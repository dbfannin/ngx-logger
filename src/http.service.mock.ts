import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class NGXLoggerHttpServiceMock {
  constructor() {

  }

  logOnServer(url: string, message: string, additional: any[], timestamp: string, logLevel: string): Observable<any> {
    return Observable.of({})
  }
}
