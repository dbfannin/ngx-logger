import {DEFAULT_COLOR_SCHEME} from '../resources/color-schemes';
import {NgxLoggerLevel} from '../types/logger-level.enum';

export class NGXLoggerUtils {

  static prepareMetaString(timestamp: string, logLevel: string, fileName: string, lineNumber: string) {
    const fileDetails = fileName ? ` [${fileName}:${lineNumber}]` : '';

    return `${timestamp} ${logLevel}${fileDetails}`;
  }

  static getColor(level: NgxLoggerLevel, configColorScheme?: Array<string>): string | undefined {
    switch (level) {
      case NgxLoggerLevel.TRACE:
        return this.getColorFromConfig(NgxLoggerLevel.TRACE, configColorScheme);
      case NgxLoggerLevel.DEBUG:
        return this.getColorFromConfig(NgxLoggerLevel.DEBUG, configColorScheme);
      case NgxLoggerLevel.INFO:
        return this.getColorFromConfig(NgxLoggerLevel.INFO, configColorScheme);
      case NgxLoggerLevel.LOG:
        return this.getColorFromConfig(NgxLoggerLevel.INFO, configColorScheme);
      case NgxLoggerLevel.WARN:
        return this.getColorFromConfig(NgxLoggerLevel.FATAL, configColorScheme);
      case NgxLoggerLevel.ERROR:
        return this.getColorFromConfig(NgxLoggerLevel.FATAL, configColorScheme);
      case NgxLoggerLevel.FATAL:
        return this.getColorFromConfig(NgxLoggerLevel.FATAL, configColorScheme);
      case NgxLoggerLevel.OFF:
      default:
        return;
    }
  }

  private static getColorFromConfig(level: number, configColorScheme: Array<string>): string | undefined {
    if (!configColorScheme) {
      return DEFAULT_COLOR_SCHEME[level];
    }

    return configColorScheme[level];
  }

  /**
   *  This allows us to see who called the logger
   */
  static getCallerDetails(): { lineNumber: string, fileName: string } {
    const err = (new Error(''));

    try {
      // this should produce the line which NGX Logger was called
      const callerLine = err.stack.split('\n')[4].split('/');

      // returns the file:lineNumber
      const fileLineNumber = callerLine[callerLine.length - 1].replace(/[)]/g, '').split(':');

      return {
        fileName: fileLineNumber[0],
        lineNumber: fileLineNumber[1]
      };
    } catch (e) {
      return {
        fileName: null,
        lineNumber: null
      };
    }

  }

  static prepareMessage(message) {
    try {
      if (typeof message !== 'string' && !(message instanceof Error)) {
        message = JSON.stringify(message, null, 2);
      }
    } catch (e) {
      // additional = [message, ...additional];
      message = 'The provided "message" value could not be parsed with JSON.stringify().';
    }

    return message;
  }

  static prepareAdditionalParameters(additional: any[]) {
    if (additional === null || additional === undefined) {
      return null;
    }

    return additional.map((next, idx) => {
      try {
        // We just want to make sure the JSON can be parsed, we do not want to actually change the type
        if (typeof next === 'object') {
          JSON.stringify(next);
        }

        return next;
      } catch (e) {
        return `The additional[${idx}] value could not be parsed using JSON.stringify().`;
      }
    });
  }

}
