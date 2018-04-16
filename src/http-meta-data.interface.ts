import {NgxLoggerLevel} from './types/logger-level.enum';

export class HttpMetaDataInterface {
  level: NgxLoggerLevel;
  timestamp: string;
  fileName: string;
  lineNumber: string;
}