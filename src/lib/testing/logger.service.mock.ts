import {HttpHeaders} from '@angular/common/http';
import {NGXLoggerMonitor} from '../logger-monitor';
import {LoggerConfig} from '../logger.config';

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

  registerMonitor(monitor: NGXLoggerMonitor) {
  }

  getConfigSnapshot(): LoggerConfig {
    return new LoggerConfig();
  }
}
