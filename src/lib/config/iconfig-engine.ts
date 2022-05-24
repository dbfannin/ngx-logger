import { NgxLoggerLevel } from './../types/logger-level.enum';
import { INGXLoggerConfig } from './iconfig';

export interface INGXLoggerConfigEngine {

  /** Get a readonly access to the level configured for the NGXLogger */
  readonly level: NgxLoggerLevel;

  /** Get a readonly access to the serverLogLevel configured for the NGXLogger */
  readonly serverLogLevel: NgxLoggerLevel;

  /** Update the config */
  updateConfig(config: INGXLoggerConfig): void;

  /** Update the config partially
   * This is useful if you want to update only one parameter of the config
   */
  partialUpdateConfig(partialConfig: Partial<INGXLoggerConfig>): void;

  /** Gets the confing */
  getConfig(): INGXLoggerConfig;
}
