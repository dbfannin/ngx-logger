import { INGXLoggerConfig } from '../config/iconfig';
import { INGXLoggerMetadata } from '../metadata/imetadata';
import { INGXLoggerMonitor } from './ilogger-monitor';

// I kept this class alive only to avoid a breaking change with the old version
// This class does not implement anything so it is useless and the interface is enough

/**
 * @deprecated this class does not implement anything thus being useless, you should rather implements @see INGXLoggerMonitor
 */
export abstract class NGXLoggerMonitor implements INGXLoggerMonitor {
  abstract onLog(logObject: INGXLoggerMetadata, config: INGXLoggerConfig): void;
}
