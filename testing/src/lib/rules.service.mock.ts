import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerRulesService, NgxLoggerLevel } from 'ngx-logger';

@Injectable()
export class NGXLoggerRulesServiceMock implements INGXLoggerRulesService {

  public shouldCallWritter(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any, additional?: any[]): boolean {
    return false;
  }

  public shouldCallServer(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any, additional?: any[]): boolean {
    return false;
  }

  public shouldCallMonitor(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any, additional?: any[]): boolean {
    return false;
  }
}
