import {LoggerColorScheme} from './types/logger-color-scheme';
import {NgxLoggerLevel} from './types/logger-level.enum';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  disableConsoleLogging?: boolean;
  httpResponseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  enableSourceMaps?: boolean;
  /** Number of calls that will be ignored when trying to get line of stacktrace
   * The base number is 5. The result number is 5 + proxiedSteps
  */
 proxiedSteps?: number;
  /** Timestamp format: any format accepted by Angular DatePipe. Defaults to ISOString */
  timestampFormat?: string;
  colorScheme?: LoggerColorScheme;
  disableFileDetails?: boolean;
}
