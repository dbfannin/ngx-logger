import { INGXLoggerConfig } from "../config/iconfig";
import { NgxLoggerLevel } from "../types/logger-level.enum";

/**
 * Injection token of logger metadata service
 */
export const TOKEN_LOGGER_RULES_SERVICE = 'TOKEN_LOGGER_RULES_SERVICE';

/**
 * Service used to know if some of the feature of the logger should be used or not
 */
export interface INGXLoggerRulesService {
  /**
   * If true the logger will write logs to console
   * @param level 
   * @param config 
   * @param message 
   * @param additional 
   */
  shouldCallWriter(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean;
  /**
   * If true the logger will send logs to server
   * @param level 
   * @param config 
   * @param message 
   * @param additional 
   */
  shouldCallServer(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean;
  /**
   * If true the logger will call the loggerMonitor
   * @param level 
   * @param config 
   * @param message 
   * @param additional 
   */
  shouldCallMonitor(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean;
}
