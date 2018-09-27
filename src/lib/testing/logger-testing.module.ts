import {NgModule} from '@angular/core';

import {NGXLogger} from '../logger.service';
import {NGXLoggerMock} from './logger.service.mock';
import {NGXLoggerHttpService} from '../http.service';
import {NGXLoggerHttpServiceMock} from './http.service.mock';
import {CustomNGXLoggerService} from '../custom-logger.service';
import {CustomNGXLoggerServiceMock} from './custom-logger.service.mock';

@NgModule({
  providers: [
    {provide: NGXLogger, useClass: NGXLoggerMock},
    {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock},
    {provide: CustomNGXLoggerService, useClass: CustomNGXLoggerServiceMock},
  ]
})
export class LoggerTestingModule {
}
