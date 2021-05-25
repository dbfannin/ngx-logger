import { INGXLoggerConfig } from "../config/iconfig";
import { NgxLoggerLevel } from "../types/logger-level.enum";

/**
 * Injection token of logger metadata service
 */
export const TOKEN_LOGGER_RULES_SERVICE = 'TOKEN_LOGGER_RULES_SERVICE';

export interface INGXLoggerRulesService {
  shouldCallWritter(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean;
  shouldCallServer(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean;
  shouldCallMonitor(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean;
}
