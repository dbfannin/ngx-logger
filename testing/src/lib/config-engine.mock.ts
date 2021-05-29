import { INGXLoggerConfig, NgxLoggerLevel, INGXLoggerConfigEngine } from 'ngx-logger';
import { Injectable } from '@angular/core';

@Injectable()
export class NGXLoggerConfigEngineMock implements INGXLoggerConfigEngine {

  get level(): NgxLoggerLevel {
    return NgxLoggerLevel.ERROR;
  }

  get serverLogLevel(): NgxLoggerLevel {
    return NgxLoggerLevel.OFF;
  }

  updateConfig(config: INGXLoggerConfig) {
  }

  getConfig(): INGXLoggerConfig {
    return { level: NgxLoggerLevel.ERROR };
  }
}