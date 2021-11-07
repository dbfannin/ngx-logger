import { NGXLoggerMock } from './logger.service.mock';
import { Injectable } from "@angular/core";

/**
 * CustomNGXLoggerServiceMock is a mock for CustomNGXLoggerService
 */
@Injectable()
export class CustomNGXLoggerServiceMock {

  create(): NGXLoggerMock {
    return new NGXLoggerMock();
  }
}


