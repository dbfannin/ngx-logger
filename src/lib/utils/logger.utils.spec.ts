import { LoggerConfig } from './../logger.config';
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
      config.customColorScheme = ['#800080', '#008080', '#808080', '#808080', '#FF0000', '#FF0000', '#FF0000'];

      const color = NGXLoggerUtils.getColor(NgxLoggerLevel.DEBUG, config.customColorScheme);

      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.TRACE, config.customColorScheme)).toBe('#800080');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.DEBUG, config.customColorScheme)).toBe('#008080');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.INFO, config.customColorScheme)).toBe('#808080');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.LOG, config.customColorScheme)).toBe('#808080');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.WARN, config.customColorScheme)).toBe('#FF0000');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.ERROR, config.customColorScheme)).toBe('#FF0000');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.FATAL, config.customColorScheme)).toBe('#FF0000');
      expect(NGXLoggerUtils.getColor(NgxLoggerLevel.OFF, config.customColorScheme)).toBeUndefined();
    });
  });
});
