import {LoggerConfig} from './logger.config';
import { NgxLoggerLevel } from './types/logger-level.enum';

export class NGXLoggerConfigEngine {

  private _config: LoggerConfig;
  constructor(readonly config: LoggerConfig) {
    this._config = config;
  }

  /** Get a readonly access to the level configured for the NGXLogger */
  get level(): NgxLoggerLevel {
    return this._config.level;
  }

  /** Get a readonly access to the serverLogLevel configured for the NGXLogger */
  get serverLogLevel(): NgxLoggerLevel {
    return this._config.serverLogLevel;
  }

  updateConfig(config: LoggerConfig) {
    this._config = this._clone(config);
  }

  getConfig() {
    return this._clone(this._config);
  }

  // TODO: add tests around cloning the config. updating an object passed into the config (or retrieving from the config)
  // should not update the active config, this is a shallow clone. If our config ever becomes hierarchical we must make
  // this a deep clone
  private _clone(object: any) {
    const cloneConfig: LoggerConfig = new LoggerConfig();

    Object.keys(object).forEach((key) => {
      cloneConfig[key] = object[key];
    });

    return cloneConfig;
  }
}
