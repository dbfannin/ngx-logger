import {Injectable, Optional} from '@angular/core';
import * as moment from 'moment';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import * as moment from 'moment';

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
  private _isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//);

  constructor(private http: HttpClient, @Optional() private options: LoggerConfig) {
    this._serverLogLevelIdx = this._initLogLevel(this.options.serverLogLevel);
    this._clientLogLevelIdx = this._initLogLevel(this.options.level);
  }

    private _timestamp() {
        return moment.utc().format();
    }

    private _initLogLevel(level) {
        level = level ? Levels.indexOf(level.toUpperCase()) : -1;
        return level === -1 ? Levels.indexOf('INFO') : level;
    }
  private _logOnServer(level: string, message: string) {
    if (!this.options.serverLoggingUrl) {
        return;
    }

    // if the user provides a serverLogLevel and the current level is than that do not log
    if (this._serverLogLevelIdx && Levels.indexOf(level) < this._serverLogLevelIdx) {
        return;
    }

      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      this.http.post(this.options.serverLoggingUrl, { level: level, message: message, timestamp: this._timestamp() }, { headers: headers })
          .catch(error => error)
          .subscribe(
              res => null,
              error => this._log('ERROR', false, 'FAILED TO LOG ON SERVER')
          );

  }

    private _logIE(level: string, ...messages: any[]) {
        if (level === 'WARN') {
            console.warn(`${this._timestamp()} [${level}] `, ...messages);
        } else if (level === 'ERROR') {
            console.error(`${this._timestamp()} [${level}] `, ...messages);
        } else if (level === 'INFO') {
            console.info(`${this._timestamp()} [${level}] `, ...messages);
        } else {
            console.log(`${this._timestamp()} [${level}] `, ...messages);
        }
    }


    private _log(level: string, logOnServer: boolean, ...messages: any[]) {

      // if no message or the log level is less than the environ
      if (messages.length === 0 || Levels.indexOf(level) < this._clientLogLevelIdx) {
          return;
      }
    if (logOnServer) {
      this._logOnServer(level, messages);
    }

    // Coloring doesn't work in IE
    if(this._isIE) {
      return this._logIE(level, messages);
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


        console.log(`%c${moment.utc().format()} [${level}]`, `color:${color1}`, ...messages);
  }

    debug(...messages: any[]) {
        this._log('DEBUG', true, ...messages);
    }

    info(...messages: any[]) {
        this._log('INFO', true, ...messages);
    }

    log(...messages: any[]) {
        this._log('LOG', true, ...messages);
    }

    warn(...messages: any[]) {
        this._log('WARN', true, ...messages);
    }

    error(...messages: any[]) {
        this._log('ERROR', true, ...messages);
    }

}
