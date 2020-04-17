import {DatePipe} from '@angular/common';
import {inject, TestBed} from '@angular/core/testing';
import {NGXLogger} from './logger.service';
import {NGXLoggerHttpService} from './http.service';
import {NGXLoggerHttpServiceMock} from '../../testing/src/lib/http.service.mock';
import {NGXMapperService} from './mapper.service';
import {NGXMapperServiceMock} from '../../testing/src/lib/mapper.service.mock';
import {LoggerConfig} from './logger.config';
import {NgxLoggerLevel} from './types/logger-level.enum';

describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLogger,
        {provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock},
        {provide: NGXMapperService, useClass: NGXMapperServiceMock},
        {provide: LoggerConfig, useValue: {level: NgxLoggerLevel.ERROR}},
        DatePipe
      ]
    });
  });

  it('should handle circular structures', inject(
    [NGXLogger],
    (logger: NGXLogger) => {
      const a = {
        test: 'test'
      };

      a['a'] = a;

      spyOn(console, 'error');
      spyOn(console, 'warn');


      logger.error('warn', a);
      logger.error('test', a);

      expect(console.error).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    }
  ));

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

  describe('setCustomHttpHeaders', () => {
    // TODO
  });

  describe('setCustomParams', () => {
    // TODO
  });

  describe('setWithCredentialsOptionValue', () => {
    // TODO
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

  describe('_logIE', () => {
    // TODO
  });

  describe('_logModern', () => {
    // TODO
  });

  describe('_log', () => {
    // TODO
  });
});
