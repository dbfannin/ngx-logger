import {NgxLoggerLevel} from './types/logger-level.enum';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  disableConsoleLogging?: boolean;
}
