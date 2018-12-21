import { NgxLoggerLevel } from './logger-level.enum';

export class NGXLogInterface {
    level: NgxLoggerLevel;
    timestamp: string;
    fileName: string;
    lineNumber: string;
    message: string;
    additional: any[];
}

export class GelfError {
    version: string; // GELF spec version (REQUIRED)
    host: string; // name of host, source, or app that sent message (REQUIRED)
    short_message: string; // short descriptive message (REQUIRED)
    full_message?: string; // long message; may contain backtrace
    timestamp?: number; // seconds since UNIX epoch; set to the current timestamp (now) by server if absent
    level?: number; // level equal to standard syslog levels; default is 1 (ALERT)
    _line?: number; // line in the file that caused the error
    _file?: string; // file that caused the error
}
