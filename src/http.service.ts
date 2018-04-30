import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {NGXLoggerSaveService} from './types/save.service.abstract';
import {NGXLog} from './types/ngx-log.interface';
import {LoggerConfig} from './logger.config';
import {of} from 'rxjs/observable/of';


@Injectable()
export class NGXLoggerHttpService implements NGXLoggerSaveService {
  constructor(private readonly http: HttpClient, private loggerConfig: LoggerConfig) { }
  save(log: NGXLog): Observable<any> {

    if (!this.loggerConfig.serverLoggingUrl) {
      return of({});
    }

    const body = {
      message: log.message,
      additional: log.additional,
      level: log.metaData.level,
      timestamp: log.metaData.timestamp,
      fileName: log.metaData.fileName,
      lineNumber: log.metaData.lineNumber
    };

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(this.loggerConfig.serverLoggingUrl, body, options)
  }
}
