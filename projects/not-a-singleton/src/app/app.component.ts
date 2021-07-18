import { Component } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerMetadata, INGXLoggerMonitor, NGXLogger } from 'src/public_api';

export class AppMonitor implements INGXLoggerMonitor {
  onLog(logObject: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    console.error('Hi there from the app monitor');
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private logger: NGXLogger) {
    this.logger.registerMonitor(new AppMonitor());
  }

  title = 'not-a-singleton';
}
