/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {NGXLogger} from './logger.service';
import {NGXLoggerHttpService} from './http.service';
import {NGXLoggerHttpServiceMock} from './testing/http.service.mock';
import {LoggerConfig} from './logger.config';

describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          NGXLogger,
        {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock},
        LoggerConfig
      ]
    });
  });

  it('should ...', inject([NGXLogger], (service: NGXLogger) => {
    expect(service).toBeTruthy();
  }));
});
