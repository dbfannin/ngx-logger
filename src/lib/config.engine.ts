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
    const cloneConfig: LoggerConfig = new LoggerConfig();

    Object.keys(cloneConfig).forEach((key) => {
      cloneConfig[key] = this._config[key];
    });

    return cloneConfig;
  }
}
