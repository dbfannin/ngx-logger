import { INGXLoggerConfig } from "../config/iconfig";
import { INGXLoggerMetadata } from "../metadata/imetadata";
import { INGXLoggerLogPosition } from "./ilog-position";
import { Observable } from "rxjs";

/**
 * Injection token of logger mapper service
 */
export const TOKEN_LOGGER_MAPPER_SERVICE = 'TOKEN_LOGGER_MAPPER_SERVICE';

export interface INGXLoggerMapperService {
  /**
   * Returns the log position of the caller
   * If sourceMaps are enabled, it attemps to get the source map from the server, and use that to parse the position
   * @param config 
   * @param metadata 
   * @returns 
   */
  getLogPosition(config: INGXLoggerConfig, metadata: INGXLoggerMetadata): Observable<INGXLoggerLogPosition>;
}
