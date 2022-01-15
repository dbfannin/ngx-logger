import { Injectable } from "@angular/core";
import { NGXLoggerMock } from "./logger.service.mock";

/**
 * CustomNGXLoggerServiceMock is a mock for CustomNGXLoggerService
 */
@Injectable()
export class CustomNGXLoggerServiceMock {

  create(): NGXLoggerMock {
    return new NGXLoggerMock();
  }
}


