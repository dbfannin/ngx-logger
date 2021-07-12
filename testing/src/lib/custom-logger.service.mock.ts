import {NGXLoggerMock} from './logger.service.mock';

/**
 * CustomNGXLoggerServiceMock is a mock for CustomNGXLoggerService
 */
export class CustomNGXLoggerServiceMock {

  constructor() {
  }

  create(): NGXLoggerMock {
    // you can inject your own httpService or use the default,
    return new NGXLoggerMock();
  }
}


