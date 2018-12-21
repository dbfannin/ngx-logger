import {HttpHeaders} from '@angular/common/http';
import {NGXLoggerMonitor} from '../logger-monitor';
import {LoggerConfig} from '../logger.config';

export class NGXLoggerMock {

  constructor() {
  }

  debug(message: any, ...additional: any[]) {
  }

  info(message: any, ...additional: any[]) {
  }

  notice(message: any, ...additional: any[]) {
  }

  warning(message: any, ...additional: any[]) {
  }

  err(message: any, ...additional: any[]) {
  }

  crit(message: any, ...additional: any[]) {
  }

  alert(message: any, ...additional: any[]) {
  }

  emerg(message: any, ...additional: any[]) {
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
