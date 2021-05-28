import { INGXLoggerConfig } from "../config/iconfig";
import { INGXLoggerMetadata } from "../metadata/imetadata";

/**
 * Injection token of logger writer service
 */
export const TOKEN_LOGGER_WRITER_SERVICE = 'TOKEN_LOGGER_WRITER_SERVICE';

export interface INGXLoggerWriterService {
  /**
   * Write content to the console
   * @param metadata 
   * @param config 
   */
  writeMessage(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void;
}
