import { NgModule } from '@angular/core';

import { NGXLoggerMock } from './logger.service.mock';
import { NGXLoggerHttpServiceMock } from './http.service.mock';
import { CustomNGXLoggerServiceMock } from './custom-logger.service.mock';
import { NGXMapperServiceMock } from './mapper.service.mock';
import {
  LoggerModule,
  NGXLogger,
  NGXLoggerHttpService,
  CustomNGXLoggerService,
  NGXMapperService
} from 'ngx-logger';

@NgModule({
  imports: [LoggerModule],
  providers: [
    { provide: NGXLogger, useClass: NGXLoggerMock },
    { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
    { provide: CustomNGXLoggerService, useClass: CustomNGXLoggerServiceMock },
    { provide: NGXMapperService, useClass: NGXMapperServiceMock }
  ]
})
export class LoggerTestingModule {}
