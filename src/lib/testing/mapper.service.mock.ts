import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerLogPosition } from 'src/lib/mapper/ilog-position';
import { INGXLoggerMapperService } from 'src/lib/mapper/imapper.service';
import { INGXLoggerMetadata } from 'src/lib/metadata/imetadata';

@Injectable()
export class NGXLoggerMapperServiceMock implements INGXLoggerMapperService {
  public getLogPosition(config: INGXLoggerConfig, metadata: INGXLoggerMetadata): Observable<INGXLoggerLogPosition> {
    return of({ fileName: 'test.ts' });
  }
}
