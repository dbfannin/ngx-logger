import { Inject, Injectable } from '@angular/core';
import { INGXLoggerConfig } from './config/iconfig';
import { NGXLogger } from './logger.service';
import { TOKEN_LOGGER_MAPPER_SERVICE, INGXLoggerMapperService } from './mapper/imapper.service';
import { TOKEN_LOGGER_METADATA_SERVICE, INGXLoggerMetadataService } from './metadata/imetadata.service';
import { TOKEN_LOGGER_RULES_SERVICE, INGXLoggerRulesService } from './rules/irules.service';
import { TOKEN_LOGGER_SERVER_SERVICE, INGXLoggerServerService } from './server/iserver.service';
import { TOKEN_LOGGER_WRITER_SERVICE, INGXLoggerWriterService } from './writer/iwriter.service';
import { INGXLoggerMonitor } from './monitor/ilogger-monitor';
import { INGXLoggerConfigEngineFactory, TOKEN_LOGGER_CONFIG_ENGINE_FACTORY } from './config/iconfig-engine-factory';

/**
 * CustomNGXLoggerService is designed to allow users to get a new instance of a logger
 */
@Injectable({
  providedIn: 'root'
})
export class CustomNGXLoggerService {

  constructor(
    private logger: NGXLogger,
    @Inject(TOKEN_LOGGER_CONFIG_ENGINE_FACTORY) private configEngineFactory: INGXLoggerConfigEngineFactory,
    @Inject(TOKEN_LOGGER_METADATA_SERVICE) private metadataService: INGXLoggerMetadataService,
    @Inject(TOKEN_LOGGER_RULES_SERVICE) private ruleService: INGXLoggerRulesService,
    @Inject(TOKEN_LOGGER_MAPPER_SERVICE) private mapperService: INGXLoggerMapperService,
    @Inject(TOKEN_LOGGER_WRITER_SERVICE) private writerService: INGXLoggerWriterService,
    @Inject(TOKEN_LOGGER_SERVER_SERVICE) private serverService: INGXLoggerServerService,
  ) { }


  /**
   * Create an instance of a logger
   * @deprecated this function does not have all the features, @see getNewInstance for every params available
   * @param config 
   * @param serverService 
   * @param logMonitor 
   * @param mapperService 
   * @returns 
   */
  create(
    config: INGXLoggerConfig,
    serverService?: INGXLoggerServerService,
    logMonitor?: INGXLoggerMonitor,
    mapperService?: INGXLoggerMapperService,
  ): NGXLogger {
    return this.getNewInstance({
      config,
      serverService,
      logMonitor,
      mapperService
    });
  }

  /**
   * Get a new instance of NGXLogger
   * @param params list of optional params to use when creating an instance of NGXLogger
   * @returns the new instance of NGXLogger
   */
  getNewInstance(
    params?: {
      config?: INGXLoggerConfig,
      configEngineFactory?: INGXLoggerConfigEngineFactory,
      metadataService?: INGXLoggerMetadataService,
      ruleService?: INGXLoggerRulesService,
      mapperService?: INGXLoggerMapperService,
      writerService?: INGXLoggerWriterService,
      serverService?: INGXLoggerServerService,
      logMonitor?: INGXLoggerMonitor,
      partialConfig?: { [K in keyof INGXLoggerConfig] },
    }
  ): NGXLogger {
    const logger = new NGXLogger(
      params?.config ?? this.logger.getConfigSnapshot(),
      params?.configEngineFactory ?? this.configEngineFactory,
      params?.metadataService ?? this.metadataService,
      params?.ruleService ?? this.ruleService,
      params?.mapperService ?? this.mapperService,
      params?.writerService ?? this.writerService,
      params?.serverService ?? this.serverService
    );

    if (params?.partialConfig) {
      logger.partialUpdateConfig(params.partialConfig);
    }

    if (params?.logMonitor) {
      logger.registerMonitor(params.logMonitor);
    }

    return logger;
  }
}


