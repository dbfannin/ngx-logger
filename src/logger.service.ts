import {Injectable, Optional} from '@angular/core';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {HttpClient, HttpHeaders} from '@angular/common/http';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  enableDarkTheme?: boolean;
}

export enum NgxLoggerLevel {
  TRACE = 0, DEBUG, INFO, LOG, WARN, ERROR, OFF
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

  private _serverLogLevel: NgxLoggerLevel;
  private _clientLogLevel: NgxLoggerLevel;
  private _isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//)
    || navigator.userAgent.match(/Edge\//);

  constructor(private http: HttpClient, @Optional() private options: LoggerConfig) {
    this._serverLogLevel = this.options.serverLogLevel || NgxLoggerLevel.INFO;
    this._clientLogLevel = this.options.level;
  }

  trace(message, ...additional: any[]) {
    this._log(NgxLoggerLevel.TRACE, true, message, additional);
  }

  debug(message, ...additional: any[]) {
    this._log(NgxLoggerLevel.DEBUG, true, message, additional);
  }

  info(message, ...additional: any[]) {
    this._log(NgxLoggerLevel.INFO, true, message, additional);
  }

  log(message, ...additional: any[]) {
    this._log(NgxLoggerLevel.LOG, true, message, additional);
  }

  warn(message, ...additional: any[]) {
    this._log(NgxLoggerLevel.WARN, true, message, additional);
  }

  error(message, ...additional: any[]) {
    this._log(NgxLoggerLevel.ERROR, true, message, additional);
  }

  private _timestamp() {
    return moment.utc().format();
  }

  private _logOnServer(level: NgxLoggerLevel, message, additional: any[]) {
    if (!this.options.serverLoggingUrl) {
      return;
    }

    // if the user provides a serverLogLevel and the current level is than that do not log
    if (level < this._serverLogLevel) {
      return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(this.options.serverLoggingUrl, {
      level: Levels[level],
      message: message,
      additional: additional,
      timestamp: this._timestamp()
    }, {headers})
      .subscribe(
        res => null,
        error => this._log(NgxLoggerLevel.ERROR, false, 'FAILED TO LOG ON SERVER')
      );
  }

  private _logIE(level: NgxLoggerLevel, message: string, additional: any[]) {
    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`${this._timestamp()} [${Levels[level]}] `, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
        console.error(`${this._timestamp()} [${Levels[level]}] `, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`${this._timestamp()} [${Levels[level]}] `, message, ...additional);
        break;
      default:
        console.log(`${this._timestamp()} [${Levels[level]}] `, message, ...additional);
    }
  }

  private _log(level: NgxLoggerLevel, logOnServer: boolean, message, additional: any[] = []) {

    // if no message or the log level is less than the environ
    if (!message || level < this._clientLogLevel) {
      return;
    }

    if (logOnServer) {
      this._logOnServer(level, message, additional);
    }

    if (typeof message === 'object') {
      try {
        message = JSON.stringify(message, null, 2);
      } catch (e) {
        additional = [message, ...additional];
        message = 'circular object in message. ';
      }
    }

    // Coloring doesn't work in IE
    if (this._isIE) {
      return this._logIE(level, message, additional);
    }

    let color1;

    switch (level) {
      case NgxLoggerLevel.TRACE:
        color1 = 'blue';
        break;
      case NgxLoggerLevel.DEBUG:
        color1 = 'teal';
        break;
      case NgxLoggerLevel.INFO:
      case NgxLoggerLevel.LOG:
        color1 = 'gray';
        break;
      case NgxLoggerLevel.WARN:
      case NgxLoggerLevel.ERROR:
        color1 = 'red';
        break;
      case NgxLoggerLevel.OFF:
      default:
        return;
    }

    const defaultColor = this.options.enableDarkTheme ? 'white' : 'black';
    console.log(`%c${this._timestamp()} [${Levels[level]}] %c${message}`, `color:${color1}`, `color:${defaultColor}`, ...additional);
  }

}
