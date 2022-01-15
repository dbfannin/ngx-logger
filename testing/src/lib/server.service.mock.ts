import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerMetadata, INGXLoggerServerService } from 'ngx-logger';


@Injectable()
export class NGXLoggerServerServiceMock implements INGXLoggerServerService {

  public sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
  }
}
