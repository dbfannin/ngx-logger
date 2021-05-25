import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { INGXLoggerConfig } from './../config/iconfig';
import { INGXLoggerMetadata } from './imetadata';
import { INGXLoggerMetadataService } from './imetadata-service';

@Injectable()
export class NGXLoggerMetadataService implements INGXLoggerMetadataService {

  constructor(
    protected readonly datePipe: DatePipe,
  ) { }

  public getMetadata(
    level: NgxLoggerLevel,
    config: INGXLoggerConfig,
    message?: any | (() => any),
    additional?: any[],
  ): INGXLoggerMetadata {
    const metadata: INGXLoggerMetadata = {
      level: level,
      additional: additional,
    };

    // The user can send a function
    // This is useful in order to compute string concatenation only when the log will actually be written
    if (message && typeof message === 'function') {
      metadata.message = message();
    } else {
      metadata.message = message;
    }

    if (config.timestampFormat) {
      metadata.timestamp = this.datePipe.transform(new Date(), config.timestampFormat);
    } else {
      metadata.timestamp = new Date().toISOString();
    }


    return metadata;
  }
}
