import { CommonModule, DatePipe } from '@angular/common';
import { ClassProvider, ConstructorProvider, ExistingProvider, FactoryProvider, ModuleWithProviders, NgModule, ValueProvider } from '@angular/core';

import { NGXLogger } from './logger.service';
import { CustomNGXLoggerService } from './custom-logger.service';
import { INGXLoggerConfig, TOKEN_LOGGER_CONFIG } from './config/iconfig';
import { NGXLoggerMapperService } from './mapper/mapper.service';
import { TOKEN_LOGGER_METADATA_SERVICE } from './metadata/imetadata.service';
import { NGXLoggerMetadataService } from './metadata/metadata.service';
import { TOKEN_LOGGER_RULES_SERVICE } from './rules/irules.service';
import { NGXLoggerRulesService } from './rules/rules.service';
import { TOKEN_LOGGER_MAPPER_SERVICE } from './mapper/imapper.service';
import { NGXLoggerWriterService } from './writer/writer.service';
import { TOKEN_LOGGER_WRITER_SERVICE } from './writer/iwriter.service';
import { NGXLoggerServerService } from './server/server.service';
import { TOKEN_LOGGER_SERVER_SERVICE } from './server/iserver.service';
import { NGXLoggerConfigEngineFactory } from './config/config-engine-factory';
import { TOKEN_LOGGER_CONFIG_ENGINE_FACTORY } from './config/iconfig-engine-factory';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DatePipe // DatePipe is required by metadata-service.ts
  ]
})
export class LoggerModule {
  static forRoot(
    config: INGXLoggerConfig | null | undefined,
    customProvider?: {
      configProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
      configEngineFactoryProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
      metadataProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
      ruleProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
      mapperProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
      writerProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
      serverProvider?: ValueProvider | ClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider,
    }
  ): ModuleWithProviders<LoggerModule> {
    if (!customProvider) {
      customProvider = {}
    }

    // default config provider
    if (!customProvider.configProvider) {
      customProvider.configProvider = { provide: TOKEN_LOGGER_CONFIG, useValue: config || {} };
    } else {
      // if the user provided its own config, we just make sure the injection token is correct
      if (customProvider.configProvider.provide !== TOKEN_LOGGER_CONFIG) {
        throw new Error(`Wrong injection token for configProvider, it should be ${TOKEN_LOGGER_CONFIG} and you used ${customProvider.configProvider.provide}`);
      }
    }

    // default configEngine provider
    if (!customProvider.configEngineFactoryProvider) {
      customProvider.configEngineFactoryProvider = { provide: TOKEN_LOGGER_CONFIG_ENGINE_FACTORY, useClass: NGXLoggerConfigEngineFactory };
    } else {
      // if the user provided its own configEngineFactory, we just make sure the injection token is correct
      if (customProvider.configEngineFactoryProvider.provide !== TOKEN_LOGGER_CONFIG_ENGINE_FACTORY) {
        throw new Error(`Wrong injection token for configEngineFactoryProvider, it should be '${TOKEN_LOGGER_CONFIG_ENGINE_FACTORY}' and you used '${customProvider.configEngineFactoryProvider.provide}'`);
      }
    }

    // default metadata provider
    if (!customProvider.metadataProvider) {
      customProvider.metadataProvider = { provide: TOKEN_LOGGER_METADATA_SERVICE, useClass: NGXLoggerMetadataService };
    } else {
      // if the user provided its own metadataService, we just make sure the injection token is correct
      if (customProvider.metadataProvider.provide !== TOKEN_LOGGER_METADATA_SERVICE) {
        throw new Error(`Wrong injection token for metadataProvider, it should be '${TOKEN_LOGGER_METADATA_SERVICE}' and you used '${customProvider.metadataProvider.provide}'`);
      }
    }

    // default rule provider
    if (!customProvider.ruleProvider) {
      customProvider.ruleProvider = { provide: TOKEN_LOGGER_RULES_SERVICE, useClass: NGXLoggerRulesService };
    } else {
      // if the user provided its own ruleService, we just make sure the injection token is correct
      if (customProvider.ruleProvider.provide !== TOKEN_LOGGER_RULES_SERVICE) {
        throw new Error(`Wrong injection token for ruleProvider, it should be '${TOKEN_LOGGER_RULES_SERVICE}' and you used '${customProvider.ruleProvider.provide}'`);
      }
    }

    // default mapper provider
    if (!customProvider.mapperProvider) {
      customProvider.mapperProvider = { provide: TOKEN_LOGGER_MAPPER_SERVICE, useClass: NGXLoggerMapperService };
    } else {
      // if the user provided its own mapperService, we just make sure the injection token is correct
      if (customProvider.mapperProvider.provide !== TOKEN_LOGGER_MAPPER_SERVICE) {
        throw new Error(`Wrong injection token for mapperProvider, it should be '${TOKEN_LOGGER_MAPPER_SERVICE}' and you used '${customProvider.mapperProvider.provide}'`);
      }
    }

    // default writer provider
    if (!customProvider.writerProvider) {
      customProvider.writerProvider = { provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: NGXLoggerWriterService };
    } else {
      // if the user provided its own writerService, we just make sure the injection token is correct
      if (customProvider.writerProvider.provide !== TOKEN_LOGGER_WRITER_SERVICE) {
        throw new Error(`Wrong injection token for writerProvider, it should be '${TOKEN_LOGGER_WRITER_SERVICE}' and you used '${customProvider.writerProvider.provide}'`);
      }
    }

    // default server provider
    if (!customProvider.serverProvider) {
      customProvider.serverProvider = { provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: NGXLoggerServerService };
    } else {
      // if the user provided its own serverService, we just make sure the injection token is correct
      if (customProvider.serverProvider.provide !== TOKEN_LOGGER_SERVER_SERVICE) {
        throw new Error(`Wrong injection token for serverProvider, it should be '${TOKEN_LOGGER_SERVER_SERVICE}' and you used '${customProvider.writerProvider.provide}'`);
      }
    }

    return {
      ngModule: LoggerModule,
      providers: [
        NGXLogger,
        customProvider.configProvider,
        customProvider.configEngineFactoryProvider,
        customProvider.metadataProvider,
        customProvider.ruleProvider,
        customProvider.mapperProvider,
        customProvider.writerProvider,
        customProvider.serverProvider,
        CustomNGXLoggerService,
      ]
    };
  }

  static forChild(): ModuleWithProviders<LoggerModule> {
    // todo : this forChild is useless for now because nothing is different from forRoot.
    // This should be implemented so that user can change the providers in the forChild
    return {
      ngModule: LoggerModule,
    };
  }
}
