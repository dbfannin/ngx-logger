import {NgxLoggerLevel} from './types/logger-level.enum';

export class LoggerConfig {
  level: NgxLoggerLevel;
  serverLogLevel?: NgxLoggerLevel;
  serverLoggingUrl?: string;
  disableConsoleLogging?: boolean;
  httpResponseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  enableSourceMaps?: boolean;
  /** Timestamp format. Defaults to ISOString */
  timestampFormat?: 'short' | 'medium' | 'long' | 'full' | 'shortDate' |
    'mediumDate' | 'longDate' | 'fullDate' | 'shortTime' | 'mediumTime' |
    'longTime' | 'fullTime' ;
  customColorScheme?: Array<string>;
}
