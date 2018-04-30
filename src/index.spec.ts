import {NGXLogger} from './logger.service';
import {LoggerModule, NGXLoggerHttpServiceMock, NgxLoggerLevel} from './index';
import {inject, TestBed} from '@angular/core/testing';
import {NGXLoggerSaveService} from './types/save.service.abstract';

describe('LoggerModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // this configuration will serve as a check for backwards compatibility
        LoggerModule.forRoot({
          saveLogLevel: NgxLoggerLevel.LOG,
          serverLoggingUrl: 'N/A',
          level: NgxLoggerLevel.LOG,
          saveService: NGXLoggerHttpServiceMock
        })
      ],
      providers: [
        NGXLoggerHttpServiceMock
      ]
    });
  });

  it('should ... allow custom save handlers', inject([NGXLogger, NGXLoggerSaveService],
    (logger: NGXLogger, mock: NGXLoggerSaveService) => {

      let spy = spyOn(mock, 'save').and.callThrough();

      logger.log('test message');

      expect(spy).toHaveBeenCalled();
    }));
});
