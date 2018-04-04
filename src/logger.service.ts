import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';

import {NGXLoggerHttpService} from './http.service';
import {NgxLoggerLevel} from './types/logger-lever.enum';
import {LoggerConfig} from './logger.config';
import {NGXLoggerConfigEngine} from './config.engine';

export const Levels = [
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
  private _isIE: boolean;
  private configService: NGXLoggerConfigEngine;


  constructor(private readonly httpService: NGXLoggerHttpService, loggerConfig: LoggerConfig, @Inject(PLATFORM_ID) private readonly platformId) {
    this._isIE = isPlatformBrowser(platformId) &&
        !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));

    // each instance of the logger should have their own config engine
    this.configService = new NGXLoggerConfigEngine(loggerConfig);
  }

  public trace(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.TRACE, message, additional);
  }

  public debug(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.DEBUG, message, additional);
  }

  public info(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.INFO, message, additional);
  }

  public log(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.LOG, message, additional);
  }

  public warn(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.WARN, message, additional);
  }

  public error(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.ERROR, message, additional);
  }

  public updateConfig(config: LoggerConfig) {
    this.configService.updateConfig(config);
  }

  private _logIE(level: NgxLoggerLevel, message: string, additional: any[], timestamp: string): void {

    // make sure additional isn't null or undefined so that ...additional doesn't error
    additional = additional || [];

    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`${timestamp} [${Levels[level]}] `, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
        console.error(`${timestamp} [${Levels[level]}] `, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`${timestamp} [${Levels[level]}] `, message, ...additional);
        break;
      default:
        console.log(`${timestamp} [${Levels[level]}] `, message, ...additional);
    }
  }

  private _prepareMessage(message) {
    try {
      if (message instanceof Error) {
        message = message.stack;
      } else if (typeof message !== 'string') {
        message = JSON.stringify(message, null, 2);
      }
    } catch (e) {
      // additional = [message, ...additional];
      message = 'The provided "message" value could not be parsed with JSON.stringify().';
    }

    return message;
  }

  private _prepareAdditionalParameters(additional: any[]) {
    if (additional === null || additional === undefined) {
      return null;
    }

    return additional.map((next, idx) => {
      try {
        // We just want to make sure the JSON can be parsed, we do not want to actually change the type
        if (typeof next === 'object') {
          JSON.stringify(next)
        }

        return next;
      }
      catch (e) {
        return `The additional[${idx}] value could not be parsed using JSON.stringify().`
      }
    });
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = [], logOnServer: boolean = true): void {
    if (!message) {
      return;
    }

    const logLevelString = Levels[level];

    message = this._prepareMessage(message);

    // only use validated parameters for HTTP requests
    const validatedAdditionalParameters = this._prepareAdditionalParameters(additional);

    const timestamp = new Date().toISOString();
    const config = this.configService.getConfig();

    if (logOnServer && config.serverLoggingUrl && level >= config.serverLogLevel) {
      // Allow logging on server even if client log level is off
      this.httpService.logOnServer(config.serverLoggingUrl, message, validatedAdditionalParameters, timestamp, logLevelString).subscribe((res: any) => {
            // I don't think we should do anything on success
          },
          (error: HttpErrorResponse) => {
            this._log(NgxLoggerLevel.ERROR, `FAILED TO LOG ON SERVER: ${message}`, [error], false);
          }
      );
    }


    // if no message or the log level is less than the environ
    if (level < config.level) {
      return;
    }

    // Coloring doesn't work in IE
    if (this._isIE) {
      return this._logIE(level, message, additional, timestamp);
    }

    const color = this._getColor(level);

    console.log(`%c${timestamp} [${logLevelString}]`, `color:${color}`, message, ...(additional || []));
  }

  private _getColor(level: NgxLoggerLevel): 'blue' | 'teal' | 'gray' | 'red' | undefined {
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
