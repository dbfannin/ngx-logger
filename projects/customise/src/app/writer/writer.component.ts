import { Component } from "@angular/core";
import { NGXLogger } from "src/public_api";

@Component({
  templateUrl: './writer.component.html',
})
export class WriterComponent {

  constructor(private logger: NGXLogger) {
  }

  log(): void {
    this.logger.debug('Test');
  }
}
