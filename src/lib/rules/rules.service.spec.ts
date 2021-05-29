import { TestBed } from '@angular/core/testing';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { NGXLoggerRulesService } from './rules.service';

describe('NGXLoggerRulesService', () => {
  let rulesService: NGXLoggerRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLoggerRulesService,
      ]
    });

    rulesService = TestBed.inject(NGXLoggerRulesService);
  });

  describe('shouldCallWriter', () => {
    it('should return good value', () => {

      expect(rulesService.shouldCallWriter(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR })).toBe(true);
      expect(rulesService.shouldCallWriter(NgxLoggerLevel.TRACE, { level: NgxLoggerLevel.ERROR })).toBe(false);
      expect(rulesService.shouldCallWriter(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR, disableConsoleLogging: true })).toBe(false);
      expect(rulesService.shouldCallWriter(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR, disableConsoleLogging: false })).toBe(true);
    });
  });

  describe('shouldCallServer', () => {
    it('should return good value', () => {

      expect(rulesService.shouldCallServer(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR, serverLogLevel: NgxLoggerLevel.ERROR, serverLoggingUrl: 'dummy' })).toBe(true, 'shouldCallServer 1');
      expect(rulesService.shouldCallServer(NgxLoggerLevel.TRACE, { level: NgxLoggerLevel.ERROR, serverLogLevel: NgxLoggerLevel.ERROR, serverLoggingUrl: 'dummy' })).toBe(false, 'shouldCallServer 2');
      // no server logging url so the server should not be called
      expect(rulesService.shouldCallServer(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR, serverLogLevel: NgxLoggerLevel.ERROR })).toBe(false, 'shouldCallServer 3');
    });
  });

  describe('shouldCallMonitor', () => {
    it('should return good value', () => {
      spyOn(rulesService, 'shouldCallServer').and.returnValue(false);
      spyOn(rulesService, 'shouldCallWriter').and.returnValue(false);

      expect(rulesService.shouldCallMonitor(null, null)).toBe(false);

      rulesService.shouldCallServer = jasmine.createSpy().and.returnValue(true);
      rulesService.shouldCallWriter = jasmine.createSpy().and.returnValue(false);

      expect(rulesService.shouldCallMonitor(null, null)).toBe(true);

      rulesService.shouldCallServer = jasmine.createSpy().and.returnValue(false);
      rulesService.shouldCallWriter = jasmine.createSpy().and.returnValue(true);

      expect(rulesService.shouldCallMonitor(null, null)).toBe(true);

      rulesService.shouldCallServer = jasmine.createSpy().and.returnValue(true);
      rulesService.shouldCallWriter = jasmine.createSpy().and.returnValue(true);

      expect(rulesService.shouldCallMonitor(null, null)).toBe(true);
    });
  });
});
