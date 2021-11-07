import { NgxLoggerLevel } from './../types/logger-level.enum';
import { INGXLoggerConfigEngine } from './iconfig-engine';
import { Inject, Injectable } from '@angular/core';
import { INGXLoggerConfig, TOKEN_LOGGER_CONFIG } from './iconfig';

@Injectable()
export class NGXLoggerConfigEngine implements INGXLoggerConfigEngine {

  constructor(
    @Inject(TOKEN_LOGGER_CONFIG) protected config: INGXLoggerConfig,
  ) { }

  /** Get a readonly access to the level configured for the NGXLogger */
  get level(): NgxLoggerLevel {
    return this.config.level;
  }

  /** Get a readonly access to the serverLogLevel configured for the NGXLogger */
  get serverLogLevel(): NgxLoggerLevel {
    return this.config.serverLogLevel;
  }

  updateConfig(config: INGXLoggerConfig) {
    this.config = this._clone(config);
  }

  getConfig(): INGXLoggerConfig {
    return this._clone(this.config);
  }

  // TODO: This is a shallow clone, If the config ever becomes hierarchical we must make this a deep clone
  private _clone(object: any) {
    const cloneConfig: INGXLoggerConfig = { level: null };

    Object.keys(object).forEach((key) => {
      cloneConfig[key] = object[key];
    });

    return cloneConfig;
  }
}
