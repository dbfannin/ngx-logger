import {SourceMap} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {HttpBackend, HttpRequest, HttpResponse} from '@angular/common/http';
import * as vlq from 'vlq';
import {Observable, of} from 'rxjs';
import {catchError, filter, map, retry, switchMap} from 'rxjs/operators';
import {LogPosition} from './types/log-position';

@Injectable()
export class NGXMapperService {

  // used to cache source maps
  private cache: { [key: string]: SourceMap } = {};
  private errorCache: { [key: string]: boolean } = {};

  constructor(private httpBackend: HttpBackend) {
  }

  /*
  Static Functions
 */
  private static getStackLine(): string {
    const error = new Error();

    try {
      // noinspection ExceptionCaughtLocallyJS
      throw error;
    } catch (e) {

      try {
        return error.stack.split('\n')[5];
      } catch (e) {
        return null;
      }
    }
  }

  private static getPosition(stackLine: string): LogPosition {
    // strip base path, then parse filename, line, and column
    const position = stackLine.substring(stackLine.lastIndexOf('\/') + 1, stackLine.indexOf(')'));
    const dataArray = position.split(':');
    if (dataArray.length === 3) {
      return new LogPosition(dataArray[0], +dataArray[1], +dataArray[2]);
    }
    return new LogPosition('unknown', 0, 0);
  }

  private static getTranspileLocation(stackLine: string): string {
    return stackLine.substring(stackLine.indexOf('(') + 1, stackLine.indexOf(')'));
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
            return new LogPosition(sourceMap.sources[sourceFileIndex], sourceCodeLine - 1, sourceCodeColumn);
          } else if (columnIndex + 1 === columns.length) {
            // matching column not found, but line is correct
            return new LogPosition(sourceMap.sources[sourceFileIndex], sourceCodeLine - 1, 0);
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

    return this.httpBackend.handle(req).pipe(
      filter(e => (e instanceof HttpResponse)),
      map<HttpResponse<SourceMap>, SourceMap>((httpResponse: HttpResponse<SourceMap>) => httpResponse.body),
      map<SourceMap, LogPosition>(sourceMap => {
        // store file in cache if not already stored
        if (!this.cache.hasOwnProperty(sourceMapLocation)) {
          this.cache[sourceMapLocation] = sourceMap;
        }
        // map generated position to source position
        return NGXMapperService.getMapping(sourceMap, distPosition);
      }),
      retry(3),
      // if there is an error getting the source, map fall back to the filename and line number of
      catchError(() => {
        this.errorCache[sourceMapLocation] = true;
        return of(distPosition);
      })
    );
  }

  /**
   * Returns the LogPosition for the current log
   * If sourceMaps are enabled, it attemps to get the source map from the server, and use that to parse the file name
   * and number of the call
   * @param sourceMapsEnabled
   */
  public getCallerDetails(sourceMapsEnabled: boolean): Observable<LogPosition> {
    // parse generated file mapping from stack trace

    const stackLine = NGXMapperService.getStackLine();

    // if we were not able to parse the stackLine, just return an empty Log Position
    if (!stackLine) {
      return of(new LogPosition('', 0, 0));
    }

    return of([
      NGXMapperService.getPosition(stackLine),
      NGXMapperService.getMapFilePath(stackLine)
    ]).pipe(
      switchMap<[LogPosition, string], LogPosition>(([distPosition, sourceMapLocation]) => {

        // if source maps are not enabled, or if we've previously tried to get the source maps, but they failed,
        // then just use the position of the JS instead of the source
        if (!sourceMapsEnabled || this.errorCache.hasOwnProperty(sourceMapLocation)) {
          return of(distPosition);
        }


        // check if we have map has already, otherwise request from server
        if (this.cache.hasOwnProperty(sourceMapLocation)) {
          return of(NGXMapperService.getMapping(this.cache[sourceMapLocation], distPosition));
        }

        // finally try to get the source map and return the position
        return this._getSourceMap(sourceMapLocation, distPosition);
      })
    );


  }
}




