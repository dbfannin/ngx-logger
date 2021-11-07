import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerMetadata, INGXLoggerMetadataService, NgxLoggerLevel } from 'ngx-logger';

@Injectable()
export class NGXLoggerMetadataServiceMock implements INGXLoggerMetadataService {

  public getMetadata(
    level: NgxLoggerLevel,
    config: INGXLoggerConfig,
    message?: any | (() => any),
    additional?: any[],
  ): INGXLoggerMetadata {
    return {
      level: level
    };
  }
}
