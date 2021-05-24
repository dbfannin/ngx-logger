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
  /** Minimum level to be written */
  level: NgxLoggerLevel;
  /** Minimum level to be sent to server */
  serverLogLevel?: NgxLoggerLevel;
  /** URL used to send log to server */
  serverLoggingUrl?: string;
  /** If true the console logging won't be called */
  disableConsoleLogging?: boolean;
  httpResponseType?: "arraybuffer" | "blob" | "text" | "json";
  enableSourceMaps?: boolean;
  /** Number of calls that will be ignored when trying to get line of stacktrace */
  proxiedSteps?: number;
  /** Timestamp format: any format accepted by Angular DatePipe. Defaults to ISOString */
  timestampFormat?: string;
  /** Defines the color to use depending on log level */
  colorScheme?: NGXLoggerColorScheme;
  /** If true the console log won't include file details (filename, line number and column number) */
  disableFileDetails?: boolean;

  withCredentials?: boolean;
  customHttpParams?: HttpParams,
  customHttpHeaders?: HttpHeaders,
}
