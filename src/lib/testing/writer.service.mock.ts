import { Injectable } from '@angular/core';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerMetadata } from 'src/lib/metadata/imetadata';
import { INGXLoggerWriterService } from 'src/lib/writer/iwriter.service';

@Injectable()
export class NGXLoggerWriterServiceMock implements INGXLoggerWriterService {
  public writeMessage(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
  }
}
