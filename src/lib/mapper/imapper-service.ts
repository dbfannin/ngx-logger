import { INGXLoggerConfig } from "../config/iconfig";
import { NgxLoggerLevel } from "../types/logger-level.enum";
import { INGXLoggerMetadata } from "../metadata/imetadata";
import { INGXLoggerLogPosition } from "./ilog-position";

/**
 * Injection token of logger mapper service
 */
export const TOKEN_LOGGER_MAPPER_SERVICE = 'TOKEN_LOGGER_MAPPER_SERVICE';

export interface INGXLoggerMapperService {
    getLogPosition(level: NgxLoggerLevel, config: INGXLoggerConfig, metadata: INGXLoggerMetadata): INGXLoggerLogPosition;
}
