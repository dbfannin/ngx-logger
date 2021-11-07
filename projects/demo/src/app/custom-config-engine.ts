import { INGXLoggerConfig, NGXLoggerConfigEngine } from "src/public_api";
import { CustomConfig } from "./custom-config";

export class CustomConfigEngine extends NGXLoggerConfigEngine {
    updateConfig(config: CustomConfig): void {
        super.updateConfig(config);
    }

    getConfig(): INGXLoggerConfig {
        return super.getConfig();
    }

}