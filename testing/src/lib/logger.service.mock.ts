import {HttpHeaders, HttpParams} from '@angular/common/http';
import {LoggerConfig, NGXLoggerMonitor} from 'ngx-logger';

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

  setWithCredentialsOptionValue(withCredentials: boolean) {
  }

  getConfigSnapshot(): LoggerConfig {
    return new LoggerConfig();
  }
}
