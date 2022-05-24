import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerConfigEngine, NgxLoggerLevel } from 'ngx-logger';

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

  partialUpdateConfig(partialConfig: Partial<INGXLoggerConfig>): void {
  }

  getConfig(): INGXLoggerConfig {
    return { level: NgxLoggerLevel.ERROR };
  }
}
