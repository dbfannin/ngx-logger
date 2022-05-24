import { Component } from '@angular/core';
import { NGXLogger } from '../../../../../src/public_api';
import { CustomInstanceService } from './custom-instance.service';

@Component({
  selector: 'app-custom-instance',
  templateUrl: './custom-instance.component.html',
  styleUrls: ['./custom-instance.component.scss'],
  providers: [
    NGXLogger
  ]
})
/**
 * The CustomInstanceComponent uses a specific instance of the logger
 */
export class CustomInstanceComponent {
  constructor(
    private logger: NGXLogger,
    private customInstanceService: CustomInstanceService,
  ) {
    logger.partialUpdateConfig({ context: 'CustomInstanceComponent' });
  }

  logWithContext(): void {
    this.logger.error('Logging from CustomInstanceComponent');
    this.customInstanceService.logWithContext();
  }
}
