/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NGXLogger } from './logger.service';
import {} from 'jasmine';

import {LoggerConfig} from './logger.config';
import {NGXLoggerSaveService} from './types/save.service.abstract';
import {NGXLog} from './types/ngx-log.interface';
import {LoggerModule, NgxLoggerLevel} from './index';
import {of} from 'rxjs/observable/of';

// Integrations tests
describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [
        // this configuration will serve as a check for backwards compatibility
        LoggerModule.forRoot({
          saveLogLevel: NgxLoggerLevel.LOG,
          serverLoggingUrl: 'N/A',
          level: NgxLoggerLevel.LOG
        })
      ]});
  });

  it('should ... resolve correct configuration values', inject([NGXLogger, LoggerConfig], (logger: NGXLogger, config: LoggerConfig) => {
    expect(logger).toBeTruthy();
    expect(config.level).toEqual(NgxLoggerLevel.LOG);
    expect(config.saveLogLevel).toEqual(NgxLoggerLevel.LOG);
    expect(config.serverLoggingUrl).toEqual('N/A');
  }));

  it('should ... save correctly', inject([NGXLogger, NGXLoggerSaveService], (logger: NGXLogger, mock: NGXLoggerSaveService) => {
    let spy = spyOn(mock, 'save').and.returnValue(of(null));

    logger.log('test message');

    expect(spy).toHaveBeenCalled();
    expect(spy.calls.first().args.length).toEqual(1);

    let log: NGXLog = spy.calls.first().args[0];

    expect(log.message).toEqual('test message');
    expect(log.additional).toEqual([]);
    expect(log.metaData.fileName).toBeTruthy();
    expect(log.metaData.level).toEqual(3);
    expect(log.metaData.timestamp).toBeTruthy();
  }));
});


