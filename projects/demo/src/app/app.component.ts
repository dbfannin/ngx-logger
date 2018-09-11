import { Component, OnInit } from '@angular/core';
import { NgxLoggerLevel, NGXLogger } from 'ngx-logger';

import { LogEvent } from './models/log-event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private logger: NGXLogger) {}

  ngOnInit() {}

  /**
   * Updates the logger config to the new log level
   * @param newLevel
   */
  handleLogLevelChange(newLevel: NgxLoggerLevel) {
    this.logger.updateConfig({ level: newLevel });
  }

  /**
   * Logs the user input using NGXLogger
   * @param log
   */
  handleLog(log: LogEvent) {
    switch (log.logType) {
      case NgxLoggerLevel.TRACE:
        this.logger.trace(log.logMessage);
        break;
      case NgxLoggerLevel.DEBUG:
        this.logger.debug(log.logMessage);
        break;
      case NgxLoggerLevel.INFO:
        this.logger.info(log.logMessage);
        break;
      case NgxLoggerLevel.LOG:
        this.logger.log(log.logMessage);
        break;
      case NgxLoggerLevel.WARN:
        this.logger.warn(log.logMessage);
        break;
      case NgxLoggerLevel.ERROR:
        this.logger.error(log.logMessage);
        break;

      default:
        break;
    }
  }
}
