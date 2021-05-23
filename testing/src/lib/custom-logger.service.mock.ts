import {NGXLoggerMock} from './logger.service.mock';
import { Injectable } from "@angular/core";

/**
 * CustomNGXLoggerServiceMock is a mock for CustomNGXLoggerService
 */
@Injectable()
export class CustomNGXLoggerServiceMock {

  constructor() {
  }

  create(): NGXLoggerMock {
    // you can inject your own httpService or use the default,
    return new NGXLoggerMock();
  }
}


