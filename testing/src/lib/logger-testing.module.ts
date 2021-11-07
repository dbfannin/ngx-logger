import { NgModule } from '@angular/core';
import {
  CustomNGXLoggerService,
  LoggerModule,
  NGXLogger,
  NgxLoggerLevel,
  TOKEN_LOGGER_CONFIG,
  TOKEN_LOGGER_CONFIG_ENGINE,
  TOKEN_LOGGER_MAPPER_SERVICE,
  TOKEN_LOGGER_METADATA_SERVICE,
  TOKEN_LOGGER_RULES_SERVICE,
  TOKEN_LOGGER_SERVER_SERVICE,
  TOKEN_LOGGER_WRITER_SERVICE
} from 'ngx-logger';
import { NGXLoggerConfigEngineMock } from './config-engine.mock';
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
    { provide: TOKEN_LOGGER_CONFIG_ENGINE, useClass: NGXLoggerConfigEngineMock },
    { provide: TOKEN_LOGGER_METADATA_SERVICE, useClass: NGXLoggerMetadataServiceMock },
    { provide: TOKEN_LOGGER_RULES_SERVICE, useClass: NGXLoggerRulesServiceMock },
    { provide: TOKEN_LOGGER_MAPPER_SERVICE, useClass: NGXLoggerMapperServiceMock },
    { provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: NGXLoggerWriterServiceMock },
    { provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: NGXLoggerServerServiceMock },
    { provide: CustomNGXLoggerService, useClass: CustomNGXLoggerServiceMock },
  ]
})
export class LoggerTestingModule { }
