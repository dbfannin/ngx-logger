import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxLoggerLevel } from 'ngx-logger';

@Component({
  selector: 'app-log-config',
  templateUrl: './log-config.component.html',
  styleUrls: ['./log-config.component.scss']
})
/**
 * The LogConfigComponent allows a user to set the current log level for ngx-logger
 */
export class LogConfigComponent implements OnInit {
  @Output()
  loggerLevelChange: EventEmitter<NgxLoggerLevel> = new EventEmitter();
  private currentLogLevel: NgxLoggerLevel = NgxLoggerLevel.DEBUG;
  constructor() {}

  ngOnInit() {}

  /**
   * Get the chip color based on the current logger level configuration
   */
  get loggerColor(): string {
    switch (this.currentLogLevel) {
      case NgxLoggerLevel.TRACE:
      case NgxLoggerLevel.DEBUG:
        return 'primary';

      case NgxLoggerLevel.INFO:
      case NgxLoggerLevel.LOG:
        return 'accent';

      case NgxLoggerLevel.WARN:
      case NgxLoggerLevel.ERROR:
        return 'warn';

      default:
        return '';
    }
  }

  /**
   * The NgxLoggerLevel enum has numbers and not strings as values. Return a string when getting the logger level
   */
  get currentLogLevelString(): string {
    switch (this.currentLogLevel) {
      case NgxLoggerLevel.TRACE:
        return 'Trace';
      case NgxLoggerLevel.DEBUG:
        return 'Debug';
      case NgxLoggerLevel.INFO:
        return 'Info';
      case NgxLoggerLevel.LOG:
        return 'Log';
      case NgxLoggerLevel.WARN:
        return 'Warn';
      case NgxLoggerLevel.ERROR:
        return 'Error';
      case NgxLoggerLevel.OFF:
        return 'Off';
    }
  }

  /**
   * Sets the current log level of the components then emits the new level to the parent component
   * @param newLevel The new logger level value that will be emitted
   */
  handleButtonClick(newLevel: string) {
    switch (newLevel) {
      case 'Trace':
        this.currentLogLevel = NgxLoggerLevel.TRACE;
        break;

      case 'Debug':
        this.currentLogLevel = NgxLoggerLevel.DEBUG;
        break;

      case 'Info':
        this.currentLogLevel = NgxLoggerLevel.INFO;
        break;

      case 'Log':
        this.currentLogLevel = NgxLoggerLevel.LOG;
        break;

      case 'Warn':
        this.currentLogLevel = NgxLoggerLevel.WARN;
        break;

      case 'Error':
        this.currentLogLevel = NgxLoggerLevel.ERROR;
        break;

      case 'Off':
        this.currentLogLevel = NgxLoggerLevel.OFF;
        break;

      default:
        break;
    }
    this.loggerLevelChange.emit(this.currentLogLevel);
  }
}
