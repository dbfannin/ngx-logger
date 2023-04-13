import { HttpHeaders, HttpParams } from "@angular/common/http";
import { NgxLoggerLevel } from "../types/logger-level.enum";
import { NGXLoggerColorScheme } from "../writer/color-scheme";

/**
 * Injection token of logger config
 */
export const TOKEN_LOGGER_CONFIG = 'TOKEN_LOGGER_CONFIG';

/**
 * Interface that defines logger config data
 * You can use your own logger config as long as it implements this interface
 */
export interface INGXLoggerConfig {
  // Global config
  /** Minimum level to be written */
  level: NgxLoggerLevel;

  // metadata-service config
  /** Timestamp format: any format accepted by Angular DatePipe. Defaults to ISOString. If set you need to provide DatePipe from @angular/common */
  timestampFormat?: string;

  // rule-service config
  /** If true the console logging won't be called */
  disableConsoleLogging?: boolean;

  // mapper-service config
  /* If true, the logger will download sourcemaps to compute the file details */
  enableSourceMaps?: boolean;
  /** Number of calls that will be ignored when trying to get line of stacktrace */
  proxiedSteps?: number;

  // writer-service config
  /** Defines the color to use depending on log level */
  colorScheme?: NGXLoggerColorScheme;
  /** If true the console log won't include file details (filename, line number and column number) */
  disableFileDetails?: boolean;
  /** Adds context to the message that will be written to the log */
  context?: string;

  // server-service config
  /** Minimum level to be sent to server */
  serverLogLevel?: NgxLoggerLevel;
  /** URL used to send log to server */
  serverLoggingUrl?: string;
  /** If true, adds "withCredentials" options when sending log to server */
  withCredentials?: boolean;
  /** Http params that will be used when sending log to server */
  customHttpParams?: HttpParams,
  /** Http headers that will be used when sending log to server */
  customHttpHeaders?: HttpHeaders,
  /** Response type that will be used when sending log to server (defaults to json) */
  httpResponseType?: "arraybuffer" | "blob" | "text" | "json";
  /** Number of logs needed before it is sent to the server
   * This means your server will receive an array of INGXLoggerMetadata instead of just one object
   */
  serverCallsBatchSize?: number;
  /** Maximum time (in miliseconds) waited before performing a log call to the server if the number of logs was not reached
   * This means your server will receive an array of INGXLoggerMetadata instead of just one object
   */
  serverCallsTimer?: number;
}
