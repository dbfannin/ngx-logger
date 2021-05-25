import { INGXLoggerConfig } from "../config/iconfig";
import { NgxLoggerLevel } from "../types/logger-level.enum";
import { INGXLoggerMetadata } from "./imetadata";

/**
 * Injection token of logger metadata service
 */
export const TOKEN_LOGGER_METADATA_SERVICE = 'TOKEN_LOGGER_METADATA_SERVICE';

export interface INGXLoggerMetadataService {
  getMetadata(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): INGXLoggerMetadata;
}
