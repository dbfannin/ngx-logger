import { SourceMap } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { HttpBackend, HttpRequest, HttpResponse } from '@angular/common/http';
import * as vlq from 'vlq';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, retry, shareReplay } from 'rxjs/operators';
import { INGXLoggerMapperService } from './imapper-service';
import { INGXLoggerConfig } from '../config/iconfig';
import { INGXLoggerMetadata } from '../metadata/imetadata';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { INGXLoggerLogPosition } from './ilog-position';

@Injectable()
export class NGXLoggerMapperService implements INGXLoggerMapperService {

  /** cache for source maps, key is source map location, ie. 'http://localhost:4200/main.js.map' */
  protected sourceMapCache: Map<string, Observable<SourceMap>> = new Map();

  /** cache for specific log position, key is the dist position, ie 'main.js:339:21' */
  protected logPositionCache: Map<string, Observable<INGXLoggerLogPosition>> = new Map();

  constructor(private httpBackend: HttpBackend) {
  }

  /**
   * Returns the log position for the current log
   * If sourceMaps are enabled, it attemps to get the source map from the server, and use that to parse the position
   * @param level 
   * @param config 
   * @param metadata 
   * @returns 
   */
  public getLogPosition(level: NgxLoggerLevel, config: INGXLoggerConfig, metadata: INGXLoggerMetadata): Observable<INGXLoggerLogPosition> {
    const stackLine = this.getStackLine(config);

    // if we were not able to parse the stackLine, just return an empty Log Position
    if (!stackLine) {
      return of({ fileName: '', lineNumber: 0, columnNumber: 0 });
    }

    const logPosition = this.getLocalPosition(stackLine);

    if (!config.enableSourceMaps) {
      return of(logPosition);
    }

    const sourceMapLocation = this.getSourceMapLocation(stackLine);
    return this.getSourceMap(sourceMapLocation, logPosition);
  }

  /**
   * Get the stackline of the original caller
   * @param config 
   * @returns null if stackline was not found
   */
  protected getStackLine(config: INGXLoggerConfig): string {
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

        return error.stack.split('\n')[(defaultProxy + (config.proxiedSteps || 0))];
      } catch (e) {
        return null;
      }
    }
  }

  /**
   * Get position of caller without using sourceMaps
   * @param stackLine 
   * @returns 
   */
  protected getLocalPosition(stackLine: string): INGXLoggerLogPosition {
    // strip base path, then parse filename, line, and column, stackline looks like this :
    // Firefox
    // handleLog@http://localhost:4200/main.js:1158:29
    // Chrome and Edge
    // at AppComponent.handleLog (app.component.ts:38)

    const positionStartIndex = stackLine.lastIndexOf('\/');
    let positionEndIndex = stackLine.indexOf(')');
    if (positionEndIndex < 0) {
      positionEndIndex = undefined;
    }

    const position = stackLine.substring(positionStartIndex + 1, positionEndIndex);
    const dataArray = position.split(':');
    if (dataArray.length === 3) {
      return { fileName: dataArray[0], lineNumber: +dataArray[1], columnNumber: +dataArray[2] };
    }
    return { fileName: 'unknown', lineNumber: 0, columnNumber: 0 };
  }

  private getTranspileLocation(stackLine: string): string {
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

  /**
   * Gets the URL of the sourcemap (the URL can be relative or absolute, it is browser dependant)
   * @param stackLine 
   * @returns 
   */
  protected getSourceMapLocation(stackLine: string): string {
    const file = this.getTranspileLocation(stackLine);
    const mapFullPath = file.substring(0, file.lastIndexOf(':'));
    return mapFullPath.substring(0, mapFullPath.lastIndexOf(':')) + '.map';
  }

  private getMapping(sourceMap: SourceMap, position: INGXLoggerLogPosition): INGXLoggerLogPosition {
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
            return { fileName: sourceMap.sources[sourceFileIndex], lineNumber: sourceCodeLine, columnNumber: sourceCodeColumn };
          } else if (columnIndex + 1 === columns.length) {
            // matching column not found, but line is correct
            return { fileName: sourceMap.sources[sourceFileIndex], lineNumber: sourceCodeLine, columnNumber: 0 };
          }
        }
      }
    }
    // failed if reached
    return { fileName: 'unknown', lineNumber: 0, columnNumber: 0 };
  }

  /**
   * does the http get request to get the source map
   * @param sourceMapLocation
   * @param distPosition
   */
  protected getSourceMap(sourceMapLocation: string, distPosition: INGXLoggerLogPosition): Observable<INGXLoggerLogPosition> {
    const req = new HttpRequest<SourceMap>('GET', sourceMapLocation);
    const distPositionKey = `${distPosition.fileName}:${distPosition.lineNumber}:${distPosition.columnNumber}`;

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
      map<SourceMap, INGXLoggerLogPosition>((sourceMap) =>
        // map generated position to source position
        this.getMapping(sourceMap, distPosition)
      ),
      catchError(() => of(distPosition)),
      shareReplay(1)
    );

    // store specific log position in cache for given dest position and return it
    this.logPositionCache.set(distPositionKey, logPosition$);

    return logPosition$;
  }
}
