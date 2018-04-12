import {NgxLoggerLevel} from './types/logger-lever.enum';

export class HttpMetaDataInterface {
  level: NgxLoggerLevel;
  timestamp: string;
  fileName: string;
  lineNumber: string;
}