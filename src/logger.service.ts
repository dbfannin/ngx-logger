import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import * as moment from 'moment';

export class LoggerConfig {
  level: string;
  serverLoggingUrl?: string;
  serverLogLevel?: string;
  enableDarkTheme?: boolean;
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
  private _isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//)
  || navigator.userAgent.match(/Edge\//);

  constructor(private http: HttpClient, @Optional() private options: LoggerConfig) {
    this._serverLogLevelIdx = this._initLogLevel(this.options.serverLogLevel);
    this._clientLogLevelIdx = this._initLogLevel(this.options.level);
  }

  private _timestamp() {
    return moment.utc().format();
  }

  private _initLogLevel(level) {
    level = level ? level.toUpperCase() : level;
    level = Levels.indexOf(level);
    return level === -1 ? Levels.indexOf('INFO') : level;
  }

  private _logOnServer(level: string, message: string) {
    if (!this.options.serverLoggingUrl) { return; };

    // if the user provides a serverLogLevel and the current level is than that do not log
    if (this._serverLogLevelIdx && Levels.indexOf(level) < this._serverLogLevelIdx) { return; };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(this.options.serverLoggingUrl, { level: level, message: message, timestamp: this._timestamp() }, { headers: headers })
      .catch(error => error)
      .subscribe(
      res => null,
      error => this._log('ERROR', 'FAILED TO LOG ON SERVER', false)
      );

  }

  private _logIE(level: string, message: any) {
    message = `${this._timestamp()} [${level}] ${message}`;

    if (level === 'WARN') {
      console.warn(message);
    } else if (level === 'ERROR') {
      console.error(message);
    } else if (level === 'INFO') {
      console.info(message);
    } else {
      console.log(message);
    }
  }

  private _log(level: string, message: any, logOnServer: boolean) {

    // if no message or the log level is less than the environ
    if (!message || Levels.indexOf(level) < this._clientLogLevelIdx) { return; };

    if (logOnServer) {
      this._logOnServer(level, message);
    }

    if (typeof message === 'object') {
      try {
        message = JSON.stringify(message, null, 2);
      } catch (e) {
        message = `circular object in message: ${message}`;
      }
    }

    // Coloring doesn't work in IE
    if (this._isIE) {
      return this._logIE(level, message);
    }

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

    const defaultColor = this.options.enableDarkTheme ? 'white' : 'black';
    console.log(`%c${this._timestamp()} [${level}] %c${message}`, `color:${color1}`, `color:${defaultColor}`);
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
