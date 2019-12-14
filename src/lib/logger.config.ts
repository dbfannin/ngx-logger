import {NgxLoggerLevel} from './types/logger-level.enum';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  disableConsoleLogging?: boolean;
  httpResponseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  enableSourceMaps?: boolean;
  /** Custom timestamp formatter. Defaults to toISOString if undefined */
  timestampFormatter?: (Date) => string;
}
