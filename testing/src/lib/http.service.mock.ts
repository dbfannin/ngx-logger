import {Observable, of} from 'rxjs';

export class NGXLoggerHttpServiceMock {
  constructor() {

  }

  logOnServer(url: string, message: string, additional: any[], timestamp: string, logLevel: string): Observable<any> {
    return of({});
  }
}
