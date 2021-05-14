import { LoggerConfig } from '../logger.config';
import { NGXLoggerUtils } from './logger.utils';

import { NgxLoggerLevel } from '../types/logger-level.enum';

describe('NGXLoggerUtils', () => {
  describe('getColor', () => {
    it('should return default values if config is not provided', () => {
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.TRACE)).toBe('purple');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.DEBUG)).toBe('teal');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.INFO)).toBe('gray');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.LOG)).toBe('gray');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.WARN)).toBe('red');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.ERROR)).toBe('red');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.FATAL)).toBe('red');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.OFF)).toBeUndefined();
    });

    it('should return custom values if config is provided', () => {
      const config = new LoggerConfig();
      config.colorScheme = ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];

      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.TRACE, config.colorScheme)).toBe('violet');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.DEBUG, config.colorScheme)).toBe('indigo');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.INFO, config.colorScheme)).toBe('blue');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.LOG, config.colorScheme)).toBe('green');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.WARN, config.colorScheme)).toBe('yellow');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.ERROR, config.colorScheme)).toBe('orange');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.FATAL, config.colorScheme)).toBe('red');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.OFF, config.colorScheme)).toBeUndefined();
    });
  });
});
