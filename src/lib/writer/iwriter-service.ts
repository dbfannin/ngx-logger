import { INGXLoggerConfig } from "../config/iconfig";
import { INGXLoggerMetadata } from "../metadata/imetadata";

/**
 * Injection token of logger writer service
 */
export const TOKEN_LOGGER_WRITER_SERVICE = 'TOKEN_LOGGER_WRITER_SERVICE';

export interface INGXLoggerWriterService {
  writeMessage(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void;
}
