import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {NgxLoggerLevel} from './types/logger-level.enum';
import {LoggerConfig} from './logger.config';
import {NGXLoggerConfigEngine} from './config.engine';
import {LogMetaData} from './types/log-meta-data.interface';
import {NGXLoggerUtils} from './utils/logger.utils';
import {NGXLoggerSaveService} from './types/save.service.abstract';

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


  constructor(private readonly saveService: NGXLoggerSaveService, loggerConfig: LoggerConfig, @Inject(PLATFORM_ID) private readonly platformId) {
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

  private _logIE(level: NgxLoggerLevel, metaString: string, message: string, additional: any[]): void {

    // make sure additional isn't null or undefined so that ...additional doesn't error
    additional = additional || [];

    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`${metaString} `, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
        console.error(`${metaString} `, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`${metaString} `, message, ...additional);
        break;
      default:
        console.log(`${metaString} `, message, ...additional);
    }
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = [], saveLog = true): void {
    if (!message) {
      return;
    }

    const logLevelString = Levels[level];

    message = NGXLoggerUtils.prepareMessage(message);

    // only use validated parameters for HTTP requests
    const validatedAdditionalParameters = NGXLoggerUtils.prepareAdditionalParameters(additional);

    const timestamp = new Date().toISOString();
    const config = this.configService.getConfig();


    const callerDetails = NGXLoggerUtils.getCallerDetails();

    if (saveLog && level >= config.saveLogLevel) {

      const metaData: LogMetaData = {
        level: level,
        timestamp: timestamp,
        fileName: callerDetails.fileName,
        lineNumber: callerDetails.lineNumber,
      };

      // make sure the stack gets sent to the server
      message = message instanceof Error ? message.stack : message;

      // Allow saving of logs even if client log level is off
      this.saveService.save({message: message, additional: validatedAdditionalParameters, metaData: metaData})
        .subscribe(() => { },
          (error: any) => {
            this._log(NgxLoggerLevel.ERROR, `FAILED TO SAVE LOG: ${message}`, [error], false);
          }
      );
    }


    // if no message or the log level is less than the environ
    if (level < config.level) {
      return;
    }

    const metaString = NGXLoggerUtils.prepareMetaString(timestamp, logLevelString, callerDetails.fileName, callerDetails.lineNumber);

    // Coloring doesn't work in IE
    if (this._isIE) {
      return this._logIE(level, metaString, message, additional);
    }

    const color = NGXLoggerUtils.getColor(level);

    console.log(`%c${metaString}`, `color:${color}`, message, ...(additional || []));
  }
}
