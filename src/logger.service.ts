import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel: NgxLoggerLevel;
  serverLoggingUrl?: string;
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
  private _isIE: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId, @Optional() private options: LoggerConfig) {
    if (!this.options) {
      this.options = {
        level: NgxLoggerLevel.OFF,
        serverLogLevel: NgxLoggerLevel.OFF
      };
    }
    this._serverLogLevel = this.options.serverLogLevel;
    this._clientLogLevel = this.options.level;
    this._isIE = isPlatformBrowser(platformId) &&
      !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));
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
    return new Date().toISOString();
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
    if (!message) {
      return;
    }

    // Allow logging on server even if client log level is off
    if (logOnServer) {
      this._logOnServer(level, message, additional);
    }

    // if no message or the log level is less than the environ
    if (level < this._clientLogLevel) {
      return;
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

    const color = this._getColor(level);

    console.log(`%c${this._timestamp()} [${Levels[level]}]`, `color:${color}`, message, ...additional);
  }

  private _getColor(level: NgxLoggerLevel) {
    switch (level) {
      case NgxLoggerLevel.TRACE:
        return 'blue';
      case NgxLoggerLevel.DEBUG:
        return 'teal';
      case NgxLoggerLevel.INFO:
      case NgxLoggerLevel.LOG:
        return 'gray';
      case NgxLoggerLevel.WARN:
      case NgxLoggerLevel.ERROR:
        return 'red';
      case NgxLoggerLevel.OFF:
      default:
        return;
    }
  }

}
