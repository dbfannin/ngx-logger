import { Injectable } from '@angular/core';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerConfigEngine } from 'src/lib/config/iconfig-engine';
import { NgxLoggerLevel } from 'src/lib/types/logger-level.enum';

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
