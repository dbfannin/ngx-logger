import {inject, TestBed} from '@angular/core/testing';

import {NGXLogger} from './logger.service';
import {NGXLoggerHttpService} from './http.service';
import {NGXLoggerHttpServiceMock} from './testing/http.service.mock';
import {NGXMapperService} from './mapper.service';
import {NGXMapperServiceMock} from './testing/mapper.service.mock';
import {LoggerConfig} from './logger.config';

describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          NGXLogger,
        {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock},
        {provide: NGXMapperService, useClass: NGXMapperServiceMock},
        LoggerConfig
      ]
    });
  });

  it('should handle circular structures', inject([NGXLogger], (logger: NGXLogger) => {
    const a = {
      test: 'test'
    };

    a['a'] = a;

    spyOn(window, 'console');

    logger.error('test', a);

    expect(window.console).toHaveBeenCalledWith('false');

  }));
});
