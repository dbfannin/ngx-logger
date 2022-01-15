import { INGXLoggerConfig } from "./iconfig";
import { NGXLoggerConfigEngine } from "./config-engine";
import { INGXLoggerConfigEngine } from "./iconfig-engine";
import { INGXLoggerConfigEngineFactory } from "./iconfig-engine-factory";

export class NGXLoggerConfigEngineFactory implements INGXLoggerConfigEngineFactory {

  provideConfigEngine(config: INGXLoggerConfig): INGXLoggerConfigEngine {
    return new NGXLoggerConfigEngine(config);
  }

}
