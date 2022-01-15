import { NgModule } from '@angular/core';
import { TOKEN_LOGGER_CONFIG } from 'src/lib/config/iconfig';
import { TOKEN_LOGGER_CONFIG_ENGINE_FACTORY } from 'src/lib/config/iconfig-engine-factory';
import { CustomNGXLoggerService } from 'src/lib/custom-logger.service';
import { LoggerModule } from 'src/lib/logger.module';
import { NGXLogger } from 'src/lib/logger.service';
import { TOKEN_LOGGER_MAPPER_SERVICE } from 'src/lib/mapper/imapper.service';
import { TOKEN_LOGGER_METADATA_SERVICE } from 'src/lib/metadata/imetadata.service';
import { TOKEN_LOGGER_RULES_SERVICE } from 'src/lib/rules/irules.service';
import { TOKEN_LOGGER_SERVER_SERVICE } from 'src/lib/server/iserver.service';
import { NgxLoggerLevel } from 'src/lib/types/logger-level.enum';
import { TOKEN_LOGGER_WRITER_SERVICE } from 'src/lib/writer/iwriter.service';
import { NGXLoggerConfigEngineFactoryMock } from './config-engine-factory.mock';
import { CustomNGXLoggerServiceMock } from './custom-logger.service.mock';
import { NGXLoggerMock } from './logger.service.mock';
import { NGXLoggerMapperServiceMock } from './mapper.service.mock';
import { NGXLoggerMetadataServiceMock } from './metadata.service.mock';
import { NGXLoggerRulesServiceMock } from './rules.service.mock';
import { NGXLoggerServerServiceMock } from './server.service.mock';
import { NGXLoggerWriterServiceMock } from './writer.service.mock';


@NgModule({
  imports: [LoggerModule],
  providers: [
    { provide: NGXLogger, useClass: NGXLoggerMock },
    { provide: TOKEN_LOGGER_CONFIG, useValue: { level: NgxLoggerLevel.ERROR } },
    { provide: TOKEN_LOGGER_CONFIG_ENGINE_FACTORY, useClass: NGXLoggerConfigEngineFactoryMock },
    { provide: TOKEN_LOGGER_METADATA_SERVICE, useClass: NGXLoggerMetadataServiceMock },
    { provide: TOKEN_LOGGER_RULES_SERVICE, useClass: NGXLoggerRulesServiceMock },
    { provide: TOKEN_LOGGER_MAPPER_SERVICE, useClass: NGXLoggerMapperServiceMock },
    { provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: NGXLoggerWriterServiceMock },
    { provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: NGXLoggerServerServiceMock },
    { provide: CustomNGXLoggerService, useClass: CustomNGXLoggerServiceMock },
  ]
})
export class LoggerTestingModule { }
