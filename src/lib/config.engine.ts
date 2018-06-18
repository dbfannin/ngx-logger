import {LoggerConfig} from './logger.config';

export class NGXLoggerConfigEngine {

  private _config;
  constructor(readonly config: LoggerConfig) {
    this._config = config;
  }

  updateConfig(config: LoggerConfig) {
    this._config = this._clone(config);
  }

  getConfig() {
    return this._clone(this._config);
  }


  // TODO: add tests around cloning the config. updating an object passed into the config (or retrieving from the config)
  // should not update the active config
  private _clone(object: any) {
    const cloneConfig: LoggerConfig = new LoggerConfig();

    Object.keys(object).forEach((key) => {
      cloneConfig[key] = object[key];
    });

    return cloneConfig;
  }
}
