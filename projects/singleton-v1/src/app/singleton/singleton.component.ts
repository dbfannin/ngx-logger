import { Component } from "@angular/core";
import { NGXLogger, INGXLoggerMonitor, INGXLoggerConfig, INGXLoggerMetadata } from "src/public_api";

export class LocalMonitor implements INGXLoggerMonitor {
  onLog(logObject: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    console.error('Hi there from the local monitor');
  }
}

@Component({
  templateUrl: './singleton.component.html',
})
export class SingletonComponent {

  constructor(private logger: NGXLogger) {
  }

  registerLocalMonitor(): void {
    this.logger.registerMonitor(new LocalMonitor);
    console.error('Monitor registered');
  }

  log(): void {
    this.logger.debug('Test');
  }
}
