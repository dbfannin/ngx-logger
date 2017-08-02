import {Injectable, Optional} from '@angular/core';
import * as moment from 'moment'
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

export class LoggerConfig {
  level: string;
  serverLoggingUrl?: string;
  serverLogLevel?: string;
}

const Levels = [
  'TRACE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'OFF'
];

@Injectable()
export class NGXLogger {

  private _serverLogLevelIdx;
  private _clientLogLevelIdx;

  constructor(private http: Http, @Optional() private options: LoggerConfig) {
    this._serverLogLevelIdx = this._initLogLevel(this.options.serverLogLevel);
    this._clientLogLevelIdx = this._initLogLevel(this.options.level);
  }

  private _initLogLevel(level) {
    level = level ? level.toUpperCase() : level;
    level = Levels.indexOf(level);
    return level === -1 ? Levels.indexOf('INFO') : level;
  }

  private _logOnServer(level: string, message: string) {
    if (!this.options.serverLoggingUrl) return;

    //if the user provides a serverLogLevel and the current level is than that do not log
    if (this._serverLogLevelIdx && _.findIndex(Levels, level) < this._serverLogLevelIdx) return;

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    this.http.post(this.options.serverLoggingUrl, {level: level, message: message}, options)
        .map(res => res.json())
        .catch(error => error)
        .subscribe(
            res => null,
            error => this._log('ERROR', 'FAILED TO LOG ON SERVER', false)
        );

  }

  private _log(level: string, message: any, logOnServer: boolean) {

    //if no message or the log level is less than the environ
    if (!message || Levels.indexOf(level) < this._clientLogLevelIdx) return;

    let color1;


    switch (level) {
      case 'TRACE':
        color1 = 'blue';
        break;
      case 'DEBUG':
        color1 = 'teal';
        break;
      case 'INFO':
      case 'LOG':
        color1 = 'gray';
        break;
      case 'WARN':
      case 'ERROR':
        color1 = 'red';
        break;
      case 'OFF':
      default:
        return;
    }

    if(typeof message === 'object'){
      message = JSON.stringify(message, null, 2);
    }

    console.log(`%c${moment.utc().format()} [${level}] %c${message}`, `color:${color1}`, 'color:black');


    if (logOnServer) {
      this._logOnServer(level, message);
    }
  }

  trace(message: any) {
    this._log('TRACE', message, true);
  }

  debug(message: any) {
    this._log('DEBUG', message, true);
  }

  info(message: any) {
    this._log('INFO', message, true);
  }

  log(message: any) {
    this._log('LOG', message, true);
  }

  warn(message: any) {
    this._log('WARN', message, true);
  }

  error(message: any) {
    this._log('ERROR', message, true);
  }
}
