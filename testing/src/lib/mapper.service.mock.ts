import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerLogPosition, INGXLoggerMapperService, INGXLoggerMetadata } from 'ngx-logger';
import { Observable, of } from 'rxjs';


@Injectable()
export class NGXLoggerMapperServiceMock implements INGXLoggerMapperService {
  public getLogPosition(config: INGXLoggerConfig, metadata: INGXLoggerMetadata): Observable<INGXLoggerLogPosition> {
    return of({ fileName: 'test.ts' });
  }
}
