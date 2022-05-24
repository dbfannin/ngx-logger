import { Injectable } from '@angular/core';
import { CustomNGXLoggerService, NGXLogger } from '../../../../../src/public_api';

@Injectable({
  providedIn: 'root'
})
export class CustomInstanceService {
  private logger: NGXLogger;

  constructor(
    customNgxLoggerService: CustomNGXLoggerService,
  ) {
    // Be careful, by doing this
    this.logger = customNgxLoggerService.getNewInstance({ partialConfig: { context: 'CustomInstanceService' } });
  }

  logWithContext(): void {
    this.logger.error('Logging from CustomInstanceService');
  }
}


