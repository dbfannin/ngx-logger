import { Injectable } from '@angular/core';
import { CustomNGXLoggerService, NGXLogger, NgxLoggerLevel } from '../../../../../src/public_api';;

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private logger: NGXLogger;

  constructor(
    customNgxLoggerService: CustomNGXLoggerService,
  ) {
    this.logger = customNgxLoggerService.getNewInstance();

    const modifiedConfig = this.logger.getConfigSnapshot();
    modifiedConfig.level = NgxLoggerLevel.TRACE;
    this.logger.updateConfig(modifiedConfig);
  }


  doBusiness(): void {

    // Even if the appmodule has set ERROR level, this should be printed because we are using local instance of logger
    // And for that local instance the level is set to TRACE
    this.logger.trace('I do business');

    // Do stuff
  }
}


