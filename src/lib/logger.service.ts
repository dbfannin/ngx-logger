import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser, DatePipe } from '@angular/common';

import { NGXLoggerHttpService } from './http.service';
import { LogPosition } from './types/log-position';
import { NgxLoggerLevel } from './types/logger-level.enum';
import { LoggerConfig } from './logger.config';
import { NGXLoggerConfigEngine } from './config.engine';
import { NGXLoggerUtils } from './utils/logger.utils';
import { NGXLoggerMonitor } from './logger-monitor';
import { NGXLogInterface } from './types/ngx-log.interface';
import { NGXMapperService } from './mapper.service';

export const Levels = [
  'TRACE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'FATAL',
  'OFF'
];


@Injectable()
export class NGXLogger {
  private readonly _isIE: boolean;
  private readonly _logFunc: Function;
  private config: NGXLoggerConfigEngine;
  private _customHttpHeaders: HttpHeaders;
  private _customParams: HttpParams;
  private _withCredentials: boolean = false;

  private _loggerMonitor: NGXLoggerMonitor;

  constructor(private readonly mapperService: NGXMapperService, private readonly httpService: NGXLoggerHttpService,
    loggerConfig: LoggerConfig, @Inject(PLATFORM_ID) private platformId,
    private readonly datePipe: DatePipe) {
    this._isIE = isPlatformBrowser(platformId) && navigator && navigator.userAgent &&
      !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));

    // each instance of the logger should have their own config engine
    this.config = new NGXLoggerConfigEngine(loggerConfig);

    this._logFunc = this._isIE ? this._logIE.bind(this) : this._logModern.bind(this);

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

  public fatal(message, ...additional: any[]): void {
    this._log(NgxLoggerLevel.FATAL, message, additional);
  }

  public setCustomHttpHeaders(headers: HttpHeaders) {
    this._customHttpHeaders = headers;
  }

  public setCustomParams(params: HttpParams) {
    this._customParams = params;
  }

  public setWithCredentialsOptionValue(withCredentials: boolean) {
    this._withCredentials = withCredentials;
  }

  public registerMonitor(monitor: NGXLoggerMonitor) {
    this._loggerMonitor = monitor;
  }

  public updateConfig(config: LoggerConfig) {
    this.config.updateConfig(config);
  }

  public getConfigSnapshot(): LoggerConfig {
    return this.config.getConfig();
  }

  private _logIE(level: NgxLoggerLevel, metaString: string, message: string, additional: any[]): void {

    // Coloring doesn't work in IE
    // make sure additional isn't null or undefined so that ...additional doesn't error
    additional = additional || [];

    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`${metaString} `, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
      case NgxLoggerLevel.FATAL:
        console.error(`${metaString} `, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`${metaString} `, message, ...additional);
        break;
      default:
        console.log(`${metaString} `, message, ...additional);
    }
  }

  private _logModern(level: NgxLoggerLevel, metaString: string, message: string, additional: any[]): void {
    const configuredColors = this.getConfigSnapshot().colorScheme;
    const color = NGXLoggerUtils.getColor(level, configuredColors);

    // make sure additional isn't null or undefined so that ...additional doesn't error
    additional = additional || [];

    switch (level) {
      case NgxLoggerLevel.WARN:
        console.warn(`%c${metaString}`, `color:${color}`, message, ...additional);
        break;
      case NgxLoggerLevel.ERROR:
      case NgxLoggerLevel.FATAL:
        console.error(`%c${metaString}`, `color:${color}`, message, ...additional);
        break;
      case NgxLoggerLevel.INFO:
        console.info(`%c${metaString}`, `color:${color}`, message, ...additional);
        break;
      //  Disabling console.trace since the stack trace is not helpful. it is showing the stack trace of
      // the console.trace statement
      // case NgxLoggerLevel.TRACE:
      //   console.trace(`%c${metaString}`, `color:${color}`, message, ...additional);
      //   break;

      //  Disabling console.debug, because Has this hidden by default.
      // case NgxLoggerLevel.DEBUG:
      //   console.debug(`%c${metaString}`, `color:${color}`, message, ...additional);
      //   break;
      default:
        console.log(`%c${metaString}`, `color:${color}`, message, ...additional);
    }
  }

  private _log(level: NgxLoggerLevel, message, additional: any[] = [], logOnServer: boolean = true): void {
    const config = this.config.getConfig();
    const isLog2Server = logOnServer && config.serverLoggingUrl && level >= config.serverLogLevel;
    const isLogLevelEnabled = level >= config.level;

    if (!(message && (isLog2Server || isLogLevelEnabled))) {
      return;
    }

    const logLevelString = Levels[level];

    message = typeof message === 'function' ? message() : message;

    // only use validated parameters for HTTP requests
    const validatedAdditionalParameters = NGXLoggerUtils.prepareAdditionalParameters(additional);

    const timestamp = config.timestampFormat ?
      this.datePipe.transform(new Date(), config.timestampFormat) :
      new Date().toISOString();

    // const callerDetails = NGXLoggerUtils.getCallerDetails();
    this.mapperService.getCallerDetails(config.enableSourceMaps).subscribe((callerDetails: LogPosition) => {
      const logObject: NGXLogInterface = {
        // prepareMessage is needed to match NGXLogInterface
        // Even though I think message should be of type any (same as console.xxx signature)
        // I'm not doing this right now as this would be a breaking change
        message: NGXLoggerUtils.prepareMessage(message),
        additional: validatedAdditionalParameters,
        level: level,
        timestamp: timestamp,
        fileName: callerDetails.fileName,
        lineNumber: callerDetails.lineNumber.toString()
      };

      if (this._loggerMonitor && isLogLevelEnabled) {
        this._loggerMonitor.onLog(logObject);
      }

      if (isLog2Server) {
        // make sure the stack gets sent to the server (without altering the message for console logging)
        logObject.message = message instanceof Error ? message.stack : message;
        logObject.message = NGXLoggerUtils.prepareMessage(logObject.message);

        const headers = this._customHttpHeaders || new HttpHeaders();
        headers.set('Content-Type', 'application/json');

        const options = {
          headers: headers,
          params: this._customParams || new HttpParams(),
          responseType: config.httpResponseType || 'json',
          withCredentials: this._withCredentials
        };
        // Allow logging on server even if client log level is off
        this.httpService.logOnServer(config.serverLoggingUrl, logObject, options).subscribe((res: any) => {
          // I don't think we should do anything on success
        },
          (error: HttpErrorResponse) => {
            this._log(NgxLoggerLevel.ERROR, `FAILED TO LOG ON SERVER: ${message}`, [error], false);
          }
        );
      }


      // if no message or the log level is less than the environ
      if (isLogLevelEnabled && !config.disableConsoleLogging) {
        const metaString = NGXLoggerUtils.prepareMetaString(
          timestamp,
          logLevelString,
          config.disableFileDetails ? null : callerDetails.fileName,
          callerDetails.lineNumber.toString()
        );

        return this._logFunc(level, metaString, message, additional);
      }
    });
  }
}
