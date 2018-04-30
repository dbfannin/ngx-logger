import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {NGXLoggerSaveService, NGXLog} from './';

export class NGXLoggerHttpServiceMock implements NGXLoggerSaveService {
  save(log: NGXLog): Observable<any> {
    return Observable.of({})
  }
}
