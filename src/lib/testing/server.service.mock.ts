import { Injectable } from '@angular/core';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerMetadata } from 'src/lib/metadata/imetadata';
import { INGXLoggerServerService } from 'src/lib/server/iserver.service';

@Injectable()
export class NGXLoggerServerServiceMock implements INGXLoggerServerService {

  public sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
  }
}
