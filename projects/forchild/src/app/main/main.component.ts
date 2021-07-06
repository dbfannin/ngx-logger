import { Component } from "@angular/core";
import { NGXLogger } from "src/public_api";

@Component({
  templateUrl: './main.component.html',
})
export class MainComponent {

  constructor(private logger: NGXLogger) {
  }

  log(): void {
    this.logger.debug('Test');
  }
}
