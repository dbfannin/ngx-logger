import {HttpHeaders, HttpParams} from '@angular/common/http';
import {NGXLoggerMonitor} from '../../../src/lib/logger-monitor';
import {LoggerConfig} from '../../../src/lib/logger.config';

export class NGXLoggerMock {

  constructor() {
  }

  trace(message: any, ...additional: any[]) {
  }

  debug(message: any, ...additional: any[]) {
  }

  info(message: any, ...additional: any[]) {
  }

  log(message: any, ...additional: any[]) {
  }

  warn(message: any, ...additional: any[]) {
  }

  error(message: any, ...additional: any[]) {
  }

  fatal(message: any, ...additional: any[]) {
  }

  updateConfig(config: any) {

  }

  setCustomHttpHeaders(headers: HttpHeaders) {
  }

  setCustomParams(params: HttpParams) {
  }

  registerMonitor(monitor: NGXLoggerMonitor) {
  }

  getConfigSnapshot(): LoggerConfig {
    return new LoggerConfig();
  }
}
