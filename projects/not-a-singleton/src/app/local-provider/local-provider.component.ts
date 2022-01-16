import { Component } from "@angular/core";
import { NGXLogger, NgxLoggerLevel } from "src/public_api";

@Component({
  templateUrl: './local-provider.component.html',
  providers: [NGXLogger],
})
export class LocalProviderComponent {

  constructor(public logger: NGXLogger) {
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
