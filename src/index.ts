import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule, Provider} from '@angular/core';

import {LoggerConfig, NGXLogger} from './logger.service';
import {NGXLoggerMock} from './logger.service.mock';

export * from './logger.service.mock';
export * from './logger.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class LoggerModule {
  static forRoot(config?: LoggerConfig): ModuleWithProviders {

    const providers: Provider[] = [
      NGXLogger,
      NGXLoggerMock
    ];

    if (config) {
      providers.push({provide: LoggerConfig, useValue: config});
    }

    return {
      ngModule: LoggerModule,
      providers: providers
    };
  }
}
