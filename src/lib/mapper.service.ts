import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as vlq from 'vlq';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable()
export class NGXMapperService {

  // used to cache source maps
  private cache = {};

  constructor(private http: HttpClient) {}

  /*
  Static Functions
 */
  private static getStackLine(): string {
    const error = new Error();
    return error.stack.split('\n')[5];
  }

  private static getPosition(stackLine: string): Position {
    // strip base path, then parse filename, line, and column
    const position = stackLine.substring(stackLine.lastIndexOf('\/') + 1, stackLine.indexOf(')'));
    const dataArray = position.split(':');
    if (dataArray.length === 3) {
      return new Position(dataArray[0], +dataArray[1], +dataArray[2]);
    }
    return new Position('unknown', 0, 0);
  }

  private static getTranspileLocation(stackLine: string): string {
    return  stackLine.substring(stackLine.indexOf('(') + 1, stackLine.indexOf(')'));
  }

  private static getMapFilePath(stackLine: string): string {
    const file = NGXMapperService.getTranspileLocation(stackLine);
    const mapFullPath = file.substring(0, file.lastIndexOf(':'));
    return mapFullPath.substring(0, mapFullPath.lastIndexOf(':')) + '.map';
  }

  private static getMapping(sourceMap: SourceMap, position: Position): Position {
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
            return new Position(sourceMap.sources[sourceFileIndex], sourceCodeLine, sourceCodeColumn);
          } else if (columnIndex + 1 === columns.length) {
            // matching column not found, but line is correct
            return new Position(sourceMap.sources[sourceFileIndex], sourceCodeLine, 0);
          }
        }
      }
    }
    // failed if reached
    return new Position('unknown', 0, 0);
  }

  /*
    Public Functions
   */
  public getCallerDetails(): Observable<Position> {
    // parse generated file mapping from stack trace
    const line = NGXMapperService.getStackLine();
    const generatedPosition = NGXMapperService.getPosition(line);
    const mapLocation = NGXMapperService.getMapFilePath(line);
    // check if we have map has already, otherwise request from server
    if (this.cache.hasOwnProperty(mapLocation)) {
      return of(NGXMapperService.getMapping(this.cache[mapLocation], generatedPosition));
    }
    return this.http.get<SourceMap>(mapLocation).pipe(map(sourceMap => {
      // store file in cache if not already stored
      if (!this.cache.hasOwnProperty(mapLocation)) {
        this.cache[mapLocation] = sourceMap;
      }
      // map generated position to source position
      return NGXMapperService.getMapping(sourceMap, generatedPosition);
    }));
  }
}

interface SourceMap {
  version: string;
  sources: string[];
  names: string[];
  mappings: string;
  file: string;
}

class Position {
  constructor(
    public fileName: string,
    public lineNumber: number,
    public columnNumber: number
  ) {}
  toString() {
    return this.fileName + ':' + this.lineNumber + ':' + this.columnNumber;
  }
}
