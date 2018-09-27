import {NGXLogInterface} from './types/ngx-log.interface';

export abstract class NGXLoggerMonitor {
  abstract onLog(logObject: NGXLogInterface): void;
}
