import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {NGXLogger} from './logger.service';
import {LoggerConfig} from './logger.config';
import {CustomNGXLoggerService} from './custom-logger.service';
import {NGXLoggerHttpService} from './http.service';
import {NGXMapperService} from './mapper.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    NGXLogger,
    NGXLoggerHttpService,
    CustomNGXLoggerService,
    NGXMapperService
  ]
})
export class LoggerModule {
  static forRoot(config: LoggerConfig | null | undefined): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        {provide: LoggerConfig, useValue: config || {}},
        NGXLogger,
        NGXLoggerHttpService,
        CustomNGXLoggerService,
        NGXMapperService
      ]
    };
  }
  static forChild(): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        NGXLogger,
        NGXLoggerHttpService,
        CustomNGXLoggerService,
        NGXMapperService
      ]
    };
  }
}
