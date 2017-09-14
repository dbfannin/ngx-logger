import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {LoggerConfig, NGXLogger} from './logger.service';
import {NGXLoggerMock} from './logger.service.mock';

export {NGXLoggerMock} from './logger.service.mock';
export {NGXLogger, LoggerConfig} from './logger.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class LoggerModule {
  static forRoot(config: LoggerConfig | null | undefined): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        {provide: LoggerConfig, useValue: config || {}},
        NGXLogger,
        NGXLoggerMock
      ]
    };
  }
}
