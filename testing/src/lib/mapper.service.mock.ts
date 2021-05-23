import {Observable, of} from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class NGXMapperServiceMock {
  constructor() {

  }

  public getCallerDetails(): Observable<{fileName: string, lineNumber: number, columnNumber: number}> {
    return of({fileName: 'test.ts', lineNumber: 0, columnNumber: 0});
  }
}
