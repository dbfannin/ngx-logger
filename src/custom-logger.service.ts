import {Inject, Injectable, PLATFORM_ID} from '@angular/core';

import {LoggerConfig} from './logger.config';
import {NGXLoggerHttpService} from './http.service';
import {NGXLogger} from './logger.service';


/**
 * CustomNGXLoggerService is designed to allow users to get a new instance of a logger
 */
@Injectable()
export class CustomNGXLoggerService {

  constructor(private readonly httpService: NGXLoggerHttpService, @Inject(PLATFORM_ID) private readonly platformId) {
  }

  create(config: LoggerConfig, httpService?: NGXLoggerHttpService): NGXLogger {
    // you can inject your own httpService or use the default,
    return new NGXLogger(httpService || this.httpService, config, this.platformId);
  }
}


