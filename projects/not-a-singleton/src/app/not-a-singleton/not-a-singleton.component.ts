import { Component } from "@angular/core";
import { NGXLogger, INGXLoggerMonitor, INGXLoggerConfig, INGXLoggerMetadata, NgxLoggerLevel } from "src/public_api";

export class LocalMonitor implements INGXLoggerMonitor {
  onLog(logObject: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    console.error('Hi there from the local monitor');
  }
}

@Component({
  templateUrl: './not-a-singleton.component.html',
})
export class NotASingletonComponent {

  constructor(public logger: NGXLogger) {
  }

  registerLocalMonitor(): void {
    this.logger.registerMonitor(new LocalMonitor);
    console.error('Monitor registered');
  }

  log(): void {
    this.logger.debug('Test');
  }

  changeLogLevel(): void {
    const config = this.logger.getConfigSnapshot()
    config.level = config.level === NgxLoggerLevel.TRACE ? NgxLoggerLevel.ERROR : NgxLoggerLevel.TRACE;
    this.logger.updateConfig(config);
  }
}
