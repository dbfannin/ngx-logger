import { inject, TestBed } from '@angular/core/testing';
import { NGXLoggerConfigEngineFactoryMock } from 'src/lib/testing/config-engine-factory.mock';
import { NGXLoggerMapperServiceMock } from 'src/lib/testing/mapper.service.mock';
import { NGXLoggerMetadataServiceMock } from 'src/lib/testing/metadata.service.mock';
import { NGXLoggerRulesServiceMock } from 'src/lib/testing/rules.service.mock';
import { NGXLoggerServerServiceMock } from 'src/lib/testing/server.service.mock';
import { NGXLoggerWriterServiceMock } from 'src/lib/testing/writer.service.mock';
import { TOKEN_LOGGER_CONFIG } from './config/iconfig';
import { TOKEN_LOGGER_CONFIG_ENGINE_FACTORY } from './config/iconfig-engine-factory';
import { NGXLogger } from './logger.service';
import { TOKEN_LOGGER_MAPPER_SERVICE } from './mapper/imapper.service';
import { TOKEN_LOGGER_METADATA_SERVICE } from './metadata/imetadata.service';
import { TOKEN_LOGGER_RULES_SERVICE } from './rules/irules.service';
import { TOKEN_LOGGER_SERVER_SERVICE } from './server/iserver.service';
import { NgxLoggerLevel } from './types/logger-level.enum';
import { TOKEN_LOGGER_WRITER_SERVICE } from './writer/iwriter.service';

describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLogger,
        { provide: TOKEN_LOGGER_CONFIG, useValue: { level: NgxLoggerLevel.ERROR } },
        { provide: TOKEN_LOGGER_CONFIG_ENGINE_FACTORY, useClass: NGXLoggerConfigEngineFactoryMock },
        { provide: TOKEN_LOGGER_METADATA_SERVICE, useClass: NGXLoggerMetadataServiceMock },
        { provide: TOKEN_LOGGER_RULES_SERVICE, useClass: NGXLoggerRulesServiceMock },
        { provide: TOKEN_LOGGER_MAPPER_SERVICE, useClass: NGXLoggerMapperServiceMock },
        { provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: NGXLoggerWriterServiceMock },
        { provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: NGXLoggerServerServiceMock },
      ]
    });
  });

  describe('trace', () => {
    it('should call _log with trace', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.trace('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.TRACE, 'message', []);
      }
    ));
  });

  describe('debug', () => {
    it('should call _log with debug', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.debug('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.DEBUG, 'message', []);
      }
    ));
  });

  describe('info', () => {
    it('should call _log with info', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.info('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.INFO, 'message', []);
      }
    ));
  });

  describe('log', () => {
    it('should call _log with log', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.log('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.LOG, 'message', []);
      }
    ));
  });

  describe('warn', () => {
    it('should call _log with warn', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.warn('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.WARN, 'message', []);
      }
    ));
  });

  describe('error', () => {
    it('should call _log with error', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.error('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.ERROR, 'message', []);
      }
    ));
  });

  describe('fatal', () => {
    it('should call _log with fatal', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        const logSpy = spyOn(<any>logger, '_log');

        logger.fatal('message');

        expect(logSpy).toHaveBeenCalledWith(NgxLoggerLevel.FATAL, 'message', []);
      }
    ));
  });

  describe('level', () => {
    it('should return the level', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        expect(logger.level).toEqual(NgxLoggerLevel.ERROR);
      }
    ));
  });

  describe('serverLogLevel', () => {
    it('should return the serverLogLevel', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        expect(logger.serverLogLevel).toBe(NgxLoggerLevel.OFF);
      }
    ));
  });

  describe('registerMonitor', () => {
    // TODO
  });

  describe('updateConfig', () => {
    // TODO
  });

  describe('getConfigSnapshot', () => {
    // TODO
  });

  describe('_log', () => {
    it('should not do anything if nothing should be called', inject(
      [NGXLogger, TOKEN_LOGGER_RULES_SERVICE, TOKEN_LOGGER_METADATA_SERVICE],
      (logger: NGXLogger, ruleService: NGXLoggerRulesServiceMock, metadataService: NGXLoggerMetadataServiceMock) => {
        spyOn(ruleService, 'shouldCallWriter').and.returnValue(false);
        spyOn(ruleService, 'shouldCallServer').and.returnValue(false);
        spyOn(ruleService, 'shouldCallMonitor').and.returnValue(false);

        const metadataSpy = spyOn(metadataService, 'getMetadata');

        logger.error('Test');

        expect(metadataSpy).not.toHaveBeenCalled();
      }
    ));

    it('should not call writer', inject(
      [NGXLogger, TOKEN_LOGGER_RULES_SERVICE, TOKEN_LOGGER_WRITER_SERVICE],
      (logger: NGXLogger, ruleService: NGXLoggerRulesServiceMock, writerService: NGXLoggerWriterServiceMock) => {
        spyOn(ruleService, 'shouldCallWriter').and.returnValue(false);

        const writerSpy = spyOn(writerService, 'writeMessage');

        logger.error('Test');

        expect(writerSpy).not.toHaveBeenCalled();
      }
    ));

    it('should call writer', inject(
      [NGXLogger, TOKEN_LOGGER_RULES_SERVICE, TOKEN_LOGGER_WRITER_SERVICE],
      (logger: NGXLogger, ruleService: NGXLoggerRulesServiceMock, writerService: NGXLoggerWriterServiceMock) => {
        spyOn(ruleService, 'shouldCallWriter').and.returnValue(true);

        const writerSpy = spyOn(writerService, 'writeMessage');

        logger.error('Test');

        expect(writerSpy).toHaveBeenCalled();
      }
    ));

    it('should not call server', inject(
      [NGXLogger, TOKEN_LOGGER_RULES_SERVICE, TOKEN_LOGGER_SERVER_SERVICE],
      (logger: NGXLogger, ruleService: NGXLoggerRulesServiceMock, serverService: NGXLoggerServerServiceMock) => {
        spyOn(ruleService, 'shouldCallServer').and.returnValue(false);

        const serverSpy = spyOn(serverService, 'sendToServer');

        logger.error('Test');

        expect(serverSpy).not.toHaveBeenCalled();
      }
    ));

    it('should call server', inject(
      [NGXLogger, TOKEN_LOGGER_RULES_SERVICE, TOKEN_LOGGER_SERVER_SERVICE],
      (logger: NGXLogger, ruleService: NGXLoggerRulesServiceMock, serverService: NGXLoggerServerServiceMock) => {
        spyOn(ruleService, 'shouldCallServer').and.returnValue(true);

        const serverSpy = spyOn(serverService, 'sendToServer');

        logger.error('Test');

        expect(serverSpy).toHaveBeenCalled();
      }
    ));
  });
});
