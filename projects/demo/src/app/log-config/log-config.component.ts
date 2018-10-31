import {Component, Output, EventEmitter} from '@angular/core';
import {NgxLoggerLevel} from 'ngx-logger';

@Component({
  selector: 'app-log-config',
  templateUrl: './log-config.component.html',
  styleUrls: ['./log-config.component.scss']
})
/**
 * The LogConfigComponent allows a user to set the current log level for ngx-logger
 */
export class LogConfigComponent {
  @Output()
  loggerLevelChange: EventEmitter<NgxLoggerLevel> = new EventEmitter();
  private currentLogLevel: NgxLoggerLevel = NgxLoggerLevel.DEBUG;

  NgxLoggerLevel = NgxLoggerLevel;

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
      case NgxLoggerLevel.FATAL:
        return 'warn';

      default:
        return '';
    }
  }

  /**
   * Sets the current log level of the components then emits the new level to the parent component
   * @param newLevel The new logger level value that will be emitted
   */
  handleButtonClick(newLevel: NgxLoggerLevel) {
    this.currentLogLevel = newLevel;

    this.loggerLevelChange.emit(this.currentLogLevel);
  }
}
