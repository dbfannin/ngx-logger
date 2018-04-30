import {NgxLoggerLevel} from './logger-level.enum';

export class LogMetaData {
  level: NgxLoggerLevel;
  timestamp: string;
  fileName: string;
  lineNumber: string;
}
