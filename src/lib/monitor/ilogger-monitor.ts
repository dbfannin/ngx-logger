import { INGXLoggerConfig } from '../config/iconfig';
import { INGXLoggerMetadata } from '../metadata/imetadata';

/**
 * The monitor is called every time the log function is called as long as a log is written (either to the server or to the console)
 */
export interface INGXLoggerMonitor {
  onLog(logObject: INGXLoggerMetadata, config: INGXLoggerConfig): void;
}
