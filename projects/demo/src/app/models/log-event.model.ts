import { NgxLoggerLevel } from 'dist/ngx-logger/ngx-logger';

/**
 * The LogEvent is emitted by the LoggerFormComponent so that the log can be performed by the parent.
 */
export interface LogEvent {
  logMessage: string;
  logType: NgxLoggerLevel;
}
