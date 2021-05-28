import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerMetadata, INGXLoggerWriterService } from 'ngx-logger';

@Injectable()
export class NGXLoggerWriterServiceMock implements INGXLoggerWriterService {
  public writeMessage(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
  }
}
