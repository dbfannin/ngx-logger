import { Injectable } from '@angular/core';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerRulesService } from 'src/lib/rules/irules.service';
import { NgxLoggerLevel } from 'src/lib/types/logger-level.enum';

@Injectable()
export class NGXLoggerRulesServiceMock implements INGXLoggerRulesService {

  public shouldCallWriter(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any, additional?: any[]): boolean {
    return false;
  }

  public shouldCallServer(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any, additional?: any[]): boolean {
    return false;
  }

  public shouldCallMonitor(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any, additional?: any[]): boolean {
    return false;
  }
}
