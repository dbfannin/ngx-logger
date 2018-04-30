import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {NGXLogger} from './logger.service';
export * from './logger.service.mock';
export * from './logger.service';

import {LoggerConfig} from './logger.config';
export * from './logger.config';

import {CustomNGXLoggerService} from './custom-logger.service';
export * from './custom-logger.service';
export * from './custom-logger.service.mock';

import {NGXLoggerHttpService} from './http.service';
import {NGXLoggerSaveService} from './types/save.service.abstract';


export * from './types/save.service.abstract';
export * from './http.service';
export * from './http.service.mock';

export * from './utils/logger.utils';
export * from './types/logger-level.enum';
export * from './types/log-meta-data.interface';
export * from './types/ngx-log.interface'

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
        {provide: NGXLoggerSaveService, useClass: config.saveService || NGXLoggerHttpService},
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
