import { INGXLoggerConfig } from "../config/iconfig";
import { INGXLoggerMetadata } from "../metadata/imetadata";

/**
 * Injection token of logger server service
 */
export const TOKEN_LOGGER_SERVER_SERVICE = 'TOKEN_LOGGER_SERVER_SERVICE';

export interface INGXLoggerServerService {
  /**
   * Sends the content to be logged to the server according to the config
   * @param metadata 
   * @param config 
   */
  sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void;

  /**
   * Flush the queue of the logger
   * @param config 
   */
  flushQueue(config: INGXLoggerConfig): void;
}
