import { Inject, Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { NgxLoggerLevel } from './types/logger-level.enum';
import { INGXLoggerConfigEngine } from './config/iconfig-engine';
import { INGXLoggerConfig, TOKEN_LOGGER_CONFIG } from './config/iconfig';
import { INGXLoggerMetadataService, TOKEN_LOGGER_METADATA_SERVICE } from './metadata/imetadata.service';
import { INGXLoggerRulesService, TOKEN_LOGGER_RULES_SERVICE } from './rules/irules.service';
import { INGXLoggerMapperService, TOKEN_LOGGER_MAPPER_SERVICE } from './mapper/imapper.service';
import { INGXLoggerMonitor } from './monitor/ilogger-monitor';
import { INGXLoggerWriterService, TOKEN_LOGGER_WRITER_SERVICE } from './writer/iwriter.service';
import { INGXLoggerServerService, TOKEN_LOGGER_SERVER_SERVICE } from './server/iserver.service';
import { take } from 'rxjs/operators';
import { INGXLoggerConfigEngineFactory, TOKEN_LOGGER_CONFIG_ENGINE_FACTORY } from './config/iconfig-engine-factory';

@Injectable({
  providedIn: 'root'
})
export class NGXLogger {
  private _loggerMonitor: INGXLoggerMonitor;
  private configEngine: INGXLoggerConfigEngine;

  constructor(
    @Inject(TOKEN_LOGGER_CONFIG) config: INGXLoggerConfig,
    @Inject(TOKEN_LOGGER_CONFIG_ENGINE_FACTORY) configEngineFactory: INGXLoggerConfigEngineFactory,
    @Inject(TOKEN_LOGGER_METADATA_SERVICE) private metadataService: INGXLoggerMetadataService,
    @Inject(TOKEN_LOGGER_RULES_SERVICE) private ruleService: INGXLoggerRulesService,
    @Inject(TOKEN_LOGGER_MAPPER_SERVICE) private mapperService: INGXLoggerMapperService,
    @Inject(TOKEN_LOGGER_WRITER_SERVICE) private writerService: INGXLoggerWriterService,
    @Inject(TOKEN_LOGGER_SERVER_SERVICE) private serverService: INGXLoggerServerService,
  ) {
    this.configEngine = configEngineFactory.provideConfigEngine(config);
  }

  /** Get a readonly access to the level configured for the NGXLogger */
  get level(): NgxLoggerLevel {
    return this.configEngine.level;
  }

  /** Get a readonly access to the serverLogLevel configured for the NGXLogger */
  get serverLogLevel(): NgxLoggerLevel {
    return this.configEngine.serverLogLevel;
  }

  public trace(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.TRACE, message, additional);
  }

  public debug(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.DEBUG, message, additional);
  }

  public info(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.INFO, message, additional);
  }

  public log(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.LOG, message, additional);
  }

  public warn(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.WARN, message, additional);
  }

  public error(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.ERROR, message, additional);
  }

  public fatal(message?: any | (() => any), ...additional: any[]): void {
    this._log(NgxLoggerLevel.FATAL, message, additional);
  }

  /** @deprecated customHttpHeaders is now part of the config, this should be updated via @see updateConfig */
  public setCustomHttpHeaders(headers: HttpHeaders) {
    const config = this.getConfigSnapshot();
    config.customHttpHeaders = headers;
    this.updateConfig(config);
  }

  /** @deprecated customHttpParams is now part of the config, this should be updated via @see updateConfig */
  public setCustomParams(params: HttpParams) {
    const config = this.getConfigSnapshot();
    config.customHttpParams = params;
    this.updateConfig(config);
  }

  /** @deprecated withCredentials is now part of the config, this should be updated via @see updateConfig */
  public setWithCredentialsOptionValue(withCredentials: boolean) {
    const config = this.getConfigSnapshot();
    config.withCredentials = withCredentials;
    this.updateConfig(config);
  }

  /**
   * Register a INGXLoggerMonitor that will be trigger when a log is either written or sent to server
   * 
   * There is only one monitor, registering one will overwrite the last one if there was one
   * @param monitor 
   */
  public registerMonitor(monitor: INGXLoggerMonitor) {
    this._loggerMonitor = monitor;
  }

  /** Set config of logger
   * 
   * Warning : This overwrites all the config, if you want to update only one property, you should use @see getConfigSnapshot before
   */
  public updateConfig(config: INGXLoggerConfig) {
    this.configEngine.updateConfig(config);
  }

  /** Get config of logger */
  public getConfigSnapshot(): INGXLoggerConfig {
    return this.configEngine.getConfig();
  }

  private _log(level: NgxLoggerLevel, message?: any | (() => any), additional: any[] = []): void {
    const config = this.configEngine.getConfig();

    const shouldCallWriter = this.ruleService.shouldCallWriter(level, config, message, additional);
    const shouldCallServer = this.ruleService.shouldCallServer(level, config, message, additional);
    const shouldCallMonitor = this.ruleService.shouldCallMonitor(level, config, message, additional);

    if (!shouldCallWriter && !shouldCallServer && !shouldCallMonitor) {
      // If nothing is to be called we return
      return;
    }

    const metadata = this.metadataService.getMetadata(level, config, message, additional);
    this.mapperService.getLogPosition(config, metadata).pipe(take(1)).subscribe(logPosition => {
      if (logPosition) {
        metadata.fileName = logPosition.fileName;
        metadata.lineNumber = logPosition.lineNumber;
        metadata.columnNumber = logPosition.columnNumber;
      }

      if (shouldCallMonitor && this._loggerMonitor) {
        this._loggerMonitor.onLog(metadata, config);
      }
      if (shouldCallWriter) {
        this.writerService.writeMessage(metadata, config);
      }
      if (shouldCallServer) {
        this.serverService.sendToServer(metadata, config);
      }
    });
  }
}
