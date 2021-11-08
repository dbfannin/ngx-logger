import { Component } from "@angular/core";
import { NGXLogger } from "src/public_api";

@Component({
  templateUrl: './customise-body-server-log.component.html',
})
export class CustomiseBodyServerLogComponent {

  constructor(private logger: NGXLogger) {
  }

  log(): void {
    this.logger.debug('Test');
  }
}
