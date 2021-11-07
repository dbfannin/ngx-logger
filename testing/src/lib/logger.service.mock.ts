import { HttpHeaders, HttpParams } from '@angular/common/http';
import { INGXLoggerMonitor, INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Injectable } from "@angular/core";

// todo bmtheo, there should be an interface or something to make sure this mock sticks to the real API
@Injectable()
export class NGXLoggerMock {

  get level(): NgxLoggerLevel {
    return NgxLoggerLevel.ERROR;
  }

  get serverLogLevel(): NgxLoggerLevel {
    return NgxLoggerLevel.OFF;
  }

  trace(message?: any | (() => any), ...additional: any[]) {
  }

  debug(message?: any | (() => any), ...additional: any[]) {
  }

  info(message?: any | (() => any), ...additional: any[]) {
  }

  log(message?: any | (() => any), ...additional: any[]) {
  }

  warn(message?: any | (() => any), ...additional: any[]) {
  }

  error(message?: any | (() => any), ...additional: any[]) {
  }

  fatal(message?: any | (() => any), ...additional: any[]) {
  }

  updateConfig(config: any) {

  }

  setCustomHttpHeaders(headers: HttpHeaders) {
  }

  setCustomParams(params: HttpParams) {
  }

  registerMonitor(monitor: INGXLoggerMonitor) {
  }

  setWithCredentialsOptionValue(withCredentials: boolean) {
  }

  getConfigSnapshot(): INGXLoggerConfig {
    return { level: NgxLoggerLevel.ERROR };
  }
}
