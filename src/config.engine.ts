import {LoggerConfig} from './logger.config';

export class NGXLoggerConfigEngine {

  private _config;
  constructor(readonly config: LoggerConfig) {
    this._config = config;
  }

  updateConfig(config: LoggerConfig) {
    this._config = config;
  }

  getConfig() {
    return this._config;
  }
}
