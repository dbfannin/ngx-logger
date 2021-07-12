import { SourceMap } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { HttpBackend, HttpRequest, HttpResponse } from '@angular/common/http';
import * as vlq from 'vlq';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, retry, shareReplay, switchMap } from 'rxjs/operators';
import { LogPosition } from './types/log-position';

@Injectable({
  providedIn: 'root'
})
export class NGXMapperService {

  // cache for source maps, key is source map location, ie. 'http://localhost:4200/main.js.map'
  private sourceMapCache: Map<string, Observable<SourceMap>> = new Map();

  // cache for specific log position, key is the dist position, ie 'main.js:339:21'
  private logPositionCache: Map<string, Observable<LogPosition>> = new Map();

  constructor(private httpBackend: HttpBackend) {
  }

  /*
  Static Functions
 */
  private static getStackLine(proxiedSteps: number): string {
    const error = new Error();

    try {
      // noinspection ExceptionCaughtLocallyJS
      throw error;
    } catch (e) {

      try {
        // Here are different examples of stacktrace

        // Firefox (last line is the user code, the 4 first are ours):
        // getStackLine@http://localhost:4200/main.js:358:23
        // getCallerDetails@http://localhost:4200/main.js:557:44
        // _log@http://localhost:4200/main.js:830:28
        // debug@http://localhost:4200/main.js:652:14
        // handleLog@http://localhost:4200/main.js:1158:29

        // Chrome and Edge (last line is the user code):
        // Error
        // at Function.getStackLine (ngx-logger.js:329)
        // at NGXMapperService.getCallerDetails (ngx-logger.js:528)
        // at NGXLogger._log (ngx-logger.js:801)
        // at NGXLogger.info (ngx-logger.js:631)
        // at AppComponent.handleLog (app.component.ts:38)

        let defaultProxy = 4; // We make 4 functions call before getting here
        const firstStackLine = error.stack.split('\n')[0];
        if (!firstStackLine.includes('.js:')) {
          // The stacktrace starts with no function call (example in Chrome or Edge)
          defaultProxy = defaultProxy + 1;
        }

        return error.stack.split('\n')[(defaultProxy + (proxiedSteps || 0))];
      } catch (e) {
        return null;
      }
    }
  }

  private static getPosition(stackLine: string): LogPosition {
    // strip base path, then parse filename, line, and column
    const positionStartIndex = stackLine.lastIndexOf('\/');
    let positionEndIndex = stackLine.indexOf(')');
    if (positionEndIndex < 0) {
      positionEndIndex = undefined;
    }

    const position = stackLine.substring(positionStartIndex + 1, positionEndIndex);
    const dataArray = position.split(':');
    if (dataArray.length === 3) {
      return new LogPosition(dataArray[0], +dataArray[1], +dataArray[2]);
    }
    return new LogPosition('unknown', 0, 0);
  }

  private static getTranspileLocation(stackLine: string): string {
    // Example stackLine:
    // Firefox : getStackLine@http://localhost:4200/main.js:358:23
    // Chrome and Edge : at Function.getStackLine (ngx-logger.js:329)
    let locationStartIndex = stackLine.indexOf('(');
    if (locationStartIndex < 0) {
      locationStartIndex = stackLine.lastIndexOf('@');
      if (locationStartIndex < 0) {
        locationStartIndex = stackLine.lastIndexOf(' ');
      }
    }

    let locationEndIndex = stackLine.indexOf(')');
    if (locationEndIndex < 0) {
      locationEndIndex = undefined;
    }

    return stackLine.substring(locationStartIndex + 1, locationEndIndex);
  }

  private static getMapFilePath(stackLine: string): string {
    const file = NGXMapperService.getTranspileLocation(stackLine);
    const mapFullPath = file.substring(0, file.lastIndexOf(':'));
    return mapFullPath.substring(0, mapFullPath.lastIndexOf(':')) + '.map';
  }

  private static getMapping(sourceMap: SourceMap, position: LogPosition): LogPosition {
    // => ';' indicates end of a line
    // => ',' separates mappings in a line
    // decoded mapping => [ generatedCodeColumn, sourceFileIndex, sourceCodeLine, sourceCodeColumn, nameIndex ]
    let sourceFileIndex = 0,   // second field
      sourceCodeLine = 0,    // third field
      sourceCodeColumn = 0;  // fourth field

    const lines = sourceMap.mappings.split(';');

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      // reset column position to 0 after each line
      let generatedCodeColumn = 0;
      // decode sections in line
      const columns = lines[lineIndex].split(',');

      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const decodedSection = vlq.decode(columns[columnIndex]);
        if (decodedSection.length >= 4) {
          // update relative positions
          generatedCodeColumn += decodedSection[0];
          sourceFileIndex += decodedSection[1];
          sourceCodeLine += decodedSection[2];
          sourceCodeColumn += decodedSection[3];
        }

        // check if matching map
        if (lineIndex === position.lineNumber) {
          if (generatedCodeColumn === position.columnNumber) {
            // matching column and line found
            return new LogPosition(sourceMap.sources[sourceFileIndex], sourceCodeLine, sourceCodeColumn);
          } else if (columnIndex + 1 === columns.length) {
            // matching column not found, but line is correct
            return new LogPosition(sourceMap.sources[sourceFileIndex], sourceCodeLine, 0);
          }
        }
      }
    }
    // failed if reached
    return new LogPosition('unknown', 0, 0);
  }

  /**
   * does the http get request to get the source map
   * @param sourceMapLocation
   * @param distPosition
   */
  private _getSourceMap(sourceMapLocation: string, distPosition: LogPosition): Observable<LogPosition> {
    const req = new HttpRequest<SourceMap>('GET', sourceMapLocation);
    const distPositionKey = distPosition.toString();

    // if the specific log position is already in cache return it
    if (this.logPositionCache.has(distPositionKey)) {
      return this.logPositionCache.get(distPositionKey);
    }

    // otherwise check if the source map is already cached for given source map location
    if (!this.sourceMapCache.has(sourceMapLocation)) {
      // obtain the source map if not cached
      this.sourceMapCache.set(
        sourceMapLocation,
        this.httpBackend.handle(req).pipe(
          filter((e) => e instanceof HttpResponse),
          map<HttpResponse<SourceMap>, SourceMap>(
            (httpResponse: HttpResponse<SourceMap>) => httpResponse.body
          ),
          retry(3),
          shareReplay(1)
        )
      );
    }

    // at this point the source map is cached, use it to get specific log position mapping
    const logPosition$ = this.sourceMapCache.get(sourceMapLocation).pipe(
      map<SourceMap, LogPosition>((sourceMap) =>
        // map generated position to source position
        NGXMapperService.getMapping(sourceMap, distPosition)
      ),
      catchError(() => of(distPosition)),
      shareReplay(1)
    );

    // store specific log position in cache for given dest position and return it
    this.logPositionCache.set(distPositionKey, logPosition$);

    return logPosition$;
  }

  /**
   * Returns the LogPosition for the current log
   * If sourceMaps are enabled, it attemps to get the source map from the server, and use that to parse the file name
   * and number of the call
   * @param sourceMapsEnabled
   * @param proxiedSteps
   */
  public getCallerDetails(sourceMapsEnabled: boolean, proxiedSteps: number): Observable<LogPosition> {
    // parse generated file mapping from stack trace

    const stackLine = NGXMapperService.getStackLine(proxiedSteps);

    // if we were not able to parse the stackLine, just return an empty Log Position
    if (!stackLine) {
      return of(new LogPosition('', 0, 0));
    }

    return of([
      NGXMapperService.getPosition(stackLine),
      NGXMapperService.getMapFilePath(stackLine)
    ]).pipe(
      switchMap<[LogPosition, string], Observable<LogPosition>>(([distPosition, sourceMapLocation]) => {

        // if source maps are not enabled, or if we've previously tried to get the source maps, but they failed,
        // then just use the position of the JS instead of the source
        if (!sourceMapsEnabled) {
          return of(distPosition);
        }

        // finally try to get the source map and return the position
        return this._getSourceMap(sourceMapLocation, distPosition);
      })
    );


  }
}




