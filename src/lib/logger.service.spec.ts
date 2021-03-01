import { DatePipe } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { NGXLogger } from './logger.service';
import { NGXLoggerHttpService } from './http.service';
import { NGXLoggerHttpServiceMock } from '../../testing/src/lib/http.service.mock';
import { NGXMapperService } from './mapper.service';
import { NGXMapperServiceMock } from '../../testing/src/lib/mapper.service.mock';
import { LoggerConfig } from './logger.config';
import { NgxLoggerLevel } from './types/logger-level.enum';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogPosition } from './types/log-position';
import { of } from 'rxjs';
import { FormGroup } from '@angular/forms';

describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
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

  it('should handle complex circular structures', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
          // This structure is not "stringifyable" this make sure anything can be logged
          // Before that we used JSON.stringify and it was not working
          const complexStructure = new FormGroup({ sub: new FormGroup({}) });

          spyOn(console, 'error');

          logger.error('error', complexStructure);

          expect(console.error).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), complexStructure);

          logger.error(complexStructure);

          expect(console.error).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), complexStructure);
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

  describe('level', () => {
    it('should return the level', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        expect(logger.level).toEqual(NgxLoggerLevel.ERROR);
      }
    ));

    it('should return the good level after config changes', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        logger.updateConfig({ level: NgxLoggerLevel.TRACE });

        expect(logger.level).toEqual(NgxLoggerLevel.TRACE);
      }
    ));
  });

  describe('serverLogLevel', () => {
    it('should return the serverLogLevel', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        expect(logger.serverLogLevel).toBe(undefined);
      }
    ));

    it('should return the good serverLogLevel after config changes', inject(
      [NGXLogger],
      (logger: NGXLogger) => {
        logger.updateConfig({ level: NgxLoggerLevel.ERROR, serverLogLevel: NgxLoggerLevel.TRACE });

        expect(logger.serverLogLevel).toEqual(NgxLoggerLevel.TRACE);
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

describe('NGXLogger with mapper service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        NGXLogger,
        NGXMapperService,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe
      ]
    });
  });

  describe('call stack', () => {
    it('should get good sourceMap', inject(
      [NGXLogger],
      (logger: NGXLogger) => {

        const mapperService = TestBed.get(NGXMapperService);

        const _getSourceMapSpy = spyOn(mapperService, '_getSourceMap')
          // calling fake _getSourceMap so it does not fail the test because of failed http request
          .and.callFake((_: string, distPosition: LogPosition) => of(distPosition));

        logger.updateConfig({
          level: NgxLoggerLevel.ERROR,
          enableSourceMaps: true,
        });

        logger.error('test should get good sourceMap');

        // trying to match the sourceMap URL that looks like this : http://localhost:9876/src/lib/logger.service.spec.ts.map
        expect(_getSourceMapSpy).toHaveBeenCalledWith(jasmine.stringMatching('\/src\/lib\/logger\.service\.spec\.ts\.map'), jasmine.anything());
      }
    ));

    it('should get good LogPosition', inject(
      [NGXLogger],
      (logger: NGXLogger) => {

        const mapperService = TestBed.get(NGXMapperService);

        const _getSourceMapSpy = spyOn(mapperService, '_getSourceMap')
          // calling fake _getSourceMap so it does not fail the test because of failed http request
          .and.callFake((_: string, distPosition: LogPosition) => of(distPosition));

        logger.updateConfig({
          level: NgxLoggerLevel.ERROR,
          enableSourceMaps: true,
        });

        logger.error('test should get good LogPosition');

        // trying to match the LogPosition that looks like this logger.service.spec.ts:lineNumber:columnNumber
        // not trying to test the lineNumber and the columnNumber as these would change when the spec file changes and is too heavy to maintain
        expect(_getSourceMapSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({ fileName: 'logger.service.spec.ts' }));
      }
    ));
  });

});
