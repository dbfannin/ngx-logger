import { INGXLoggerConfig, NgxLoggerLevel, INGXLoggerMapperService, INGXLoggerMetadata, INGXLoggerLogPosition } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class NGXLoggerMapperServiceMock implements INGXLoggerMapperService {
  public getLogPosition(level: NgxLoggerLevel, config: INGXLoggerConfig, metadata: INGXLoggerMetadata): Observable<INGXLoggerLogPosition> {
    return of({ fileName: 'test.ts' });
  }
}
