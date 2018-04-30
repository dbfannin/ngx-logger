import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {NGXLogger} from './logger.service';
import {LoggerConfig} from './logger.config';
import {CustomNGXLoggerService} from './custom-logger.service';
import {NGXLoggerHttpService} from './http.service';

export * from './logger.service';

export * from './logger.config';

export * from './custom-logger.service';

export * from './http.service';

export * from './utils/logger.utils';
export * from './types/logger-level.enum';
export * from './http-meta-data.interface';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    NGXLogger,
    NGXLoggerHttpService,
    CustomNGXLoggerService
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
        CustomNGXLoggerService
      ]
    };
  }
  static forChild(): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        NGXLogger,
        NGXLoggerHttpService,
        CustomNGXLoggerService
      ]
    };
  }
}
