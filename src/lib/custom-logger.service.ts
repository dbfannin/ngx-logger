import {Inject, Injectable, PLATFORM_ID} from '@angular/core';

import {LoggerConfig} from './logger.config';
import {NGXLoggerHttpService} from './http.service';
import {NGXLogger} from './logger.service';
import {NGXLoggerMonitor} from './logger-monitor';
import {NGXMapperService} from './mapper.service';


/**
 * CustomNGXLoggerService is designed to allow users to get a new instance of a logger
 */
@Injectable()
export class CustomNGXLoggerService {

  constructor(private readonly mapperService: NGXMapperService,
              private readonly httpService: NGXLoggerHttpService) {
  }

  create(config: LoggerConfig, httpService?: NGXLoggerHttpService, logMonitor?: NGXLoggerMonitor,
         mapperService?: NGXMapperService): NGXLogger {
    // you can inject your own httpService or use the default,
    const logger = new NGXLogger(mapperService || this.mapperService,
      httpService || this.httpService, config);

    if (logMonitor) {
      logger.registerMonitor(logMonitor);
    }

    return logger;
  }
}


