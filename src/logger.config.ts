import {NgxLoggerLevel} from './types/logger-level.enum';
import {Type} from '@angular/core';
import {NGXLoggerSaveService} from './types/save.service.abstract';

export class LoggerConfig {
  level: NgxLoggerLevel;
  saveLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  saveService?: Type<NGXLoggerSaveService>
}
