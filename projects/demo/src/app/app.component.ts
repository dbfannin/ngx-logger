import { Component } from '@angular/core';
import { NGXLogger, NgxLoggerLevel } from '../../../../src/public_api';

import { LogEvent } from './models/log-event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private logger: NGXLogger) {
    logger.updateConfig
  }

  /**
   * Updates the logger config to the new log level
   * @param newLevel
   */
  handleLogLevelChange(newLevel: NgxLoggerLevel) {
    const updatedConfig = this.logger.getConfigSnapshot();
    updatedConfig.level = newLevel;
    updatedConfig.serverLogLevel = newLevel;
    this.logger.updateConfig(updatedConfig);
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
      case NgxLoggerLevel.FATAL:
        this.logger.fatal(log.logMessage);
        break;
    }
  }

  handleDisableFileDetails(disableFileDetails: boolean) {
    const updatedConfig = this.logger.getConfigSnapshot();
    updatedConfig.disableFileDetails = disableFileDetails;
    this.logger.updateConfig(updatedConfig);
  }

  serverLogging(enabled: boolean) {
    const updatedConfig = this.logger.getConfigSnapshot();
    updatedConfig.serverLoggingUrl = enabled ? '/dummyURL' : null;
    updatedConfig.serverLogLevel = enabled ? NgxLoggerLevel.TRACE : NgxLoggerLevel.OFF;
    this.logger.updateConfig(updatedConfig);
  }

  batchSize(batchSize: number) {
    const updatedConfig = this.logger.getConfigSnapshot();
    updatedConfig.serverCallsBatchSize = batchSize;
    this.logger.updateConfig(updatedConfig);
  }

  batchTimer(batchTimer: number) {
    const updatedConfig = this.logger.getConfigSnapshot();
    updatedConfig.serverCallsTimer = batchTimer;
    this.logger.updateConfig(updatedConfig);
  }
}
