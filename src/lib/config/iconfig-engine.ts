import { NgxLoggerLevel } from './../types/logger-level.enum';
import { INGXLoggerConfig } from './iconfig';

/**
 * Injection token of logger config engine
 */
 export const TOKEN_LOGGER_CONFIG_ENGINE = 'TOKEN_LOGGER_CONFIG_ENGINE';
 
 export interface INGXLoggerConfigEngine {

  /** Get a readonly access to the level configured for the NGXLogger */
  readonly level: NgxLoggerLevel;

  /** Get a readonly access to the serverLogLevel configured for the NGXLogger */
  readonly serverLogLevel: NgxLoggerLevel;

  /** Update the config */
  updateConfig(config: INGXLoggerConfig): void;

  /** Gets the confing */
  getConfig(): INGXLoggerConfig;
}
