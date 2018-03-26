import {Observable} from 'rxjs/Observable';

export class NGXLoggerHttpServiceMock {
  constructor() {

  }

  logOnServer(url: string, message: string, additional: any[], timestamp: string, logLevel: string): Observable<any> {
    return new Observable<any>(observer => {
      observer.next({});
      observer.complete();
    })
  }
}