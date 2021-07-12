import {CommonModule, DatePipe} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {LoggerConfig} from './logger.config';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DatePipe
  ]
})
export class LoggerModule {
  static forRoot(config: LoggerConfig | null | undefined): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [
        {provide: LoggerConfig, useValue: config || {}}
      ]
    };
  }
}
