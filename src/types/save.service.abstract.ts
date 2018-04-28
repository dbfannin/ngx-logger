import {Observable} from 'rxjs/Observable';
import {NGXLog} from './ngx-log.interface';

export abstract class NGXLoggerSaveService {
  abstract save(log: NGXLog): Observable<any>;
}

