import { Injectable } from '@angular/core';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerMetadata } from 'src/lib/metadata/imetadata';
import { INGXLoggerMetadataService } from 'src/lib/metadata/imetadata.service';
import { NgxLoggerLevel } from 'src/lib/types/logger-level.enum';

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
