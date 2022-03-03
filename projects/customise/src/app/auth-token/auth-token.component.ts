import { Component } from "@angular/core";
import { NGXLogger } from "src/public_api";

@Component({
  templateUrl: './auth-token.component.html',
})
export class AuthTokenComponent {

  constructor(private logger: NGXLogger) {
  }

  log(): void {
    this.logger.debug('Test');
  }
}
