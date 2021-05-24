import { INGXLoggerConfig } from "../config/iconfig";
import { INGXLoggerMetadata } from "../metadata/imetadata";

/**
 * Injection token of logger server service
 */
export const TOKEN_LOGGER_SERVER_SERVICE = 'TOKEN_LOGGER_SERVER_SERVICE';

export interface INGXLoggerServerService {
    sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void;
}
