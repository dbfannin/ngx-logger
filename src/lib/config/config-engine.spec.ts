import { inject, TestBed } from '@angular/core/testing';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { NGXLoggerConfigEngine } from './config-engine';
import { TOKEN_LOGGER_CONFIG } from './iconfig';

describe('NGXLoggerConfigEngine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLoggerConfigEngine,
        { provide: TOKEN_LOGGER_CONFIG, useValue: { level: NgxLoggerLevel.ERROR } },
      ]
    });
  });

  describe('get level', () => {
    it('should return good level', inject(
      [NGXLoggerConfigEngine],
      (configEngine: NGXLoggerConfigEngine) => {
        expect(configEngine.level).toEqual(NgxLoggerLevel.ERROR);
      }
    ));
  });

  describe('get serverLogLevel', () => {
    it('should return good serverLogLevel', inject(
      [NGXLoggerConfigEngine],
      (configEngine: NGXLoggerConfigEngine) => {
        expect(configEngine.serverLogLevel).toBe(undefined);
      }
    ));
  });

  describe('updateConfig', () => {
    it('should update config without keeping the reference to the object', inject(
      [NGXLoggerConfigEngine],
      (configEngine: NGXLoggerConfigEngine) => {
        const myNewConfig = { level: NgxLoggerLevel.FATAL, serverLoggingUrl: 'test' };

        configEngine.updateConfig(myNewConfig);

        expect(configEngine['config'].serverLoggingUrl).toEqual('test');

        myNewConfig.serverLoggingUrl = 'changed value';

        // if value here is 'changed value', this means the update config took the reference to the object
        // we don't want that because if the object is changed later it also changes the logger config
        expect(configEngine['config'].serverLoggingUrl).toEqual('test');
      }
    ));
  });

  describe('getConfig', () => {
    it('should get config without sending the reference to the object', () => {
      const configEngine = new NGXLoggerConfigEngine({ level: NgxLoggerLevel.FATAL, serverLoggingUrl: 'test' });

      const config = configEngine.getConfig();

      expect(config.serverLoggingUrl).toEqual('test');

      config.serverLoggingUrl = 'changed value';

      // if value here is 'changed value', this means the get config returned the reference to the object
      // we don't want that because if the object is changed later it also changes the logger config
      expect(configEngine.getConfig().serverLoggingUrl).toEqual('test');
    });
  });
});
