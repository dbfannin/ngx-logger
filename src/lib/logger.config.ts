import {LoggerColorScheme} from './types/logger-color-scheme';
import {NgxLoggerLevel} from './types/logger-level.enum';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  disableConsoleLogging?: boolean;
  httpResponseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  enableSourceMaps?: boolean;
  /** Timestamp format: any format accepted by Angular DatePipe. Defaults to ISOString */
  timestampFormat?: string;
  customColorScheme?: LoggerColorScheme;
}
