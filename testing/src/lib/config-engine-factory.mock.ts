import { Injectable } from '@angular/core';
import { INGXLoggerConfig, INGXLoggerConfigEngine, INGXLoggerConfigEngineFactory } from 'ngx-logger';
import { NGXLoggerConfigEngineMock } from './config-engine.mock';

@Injectable()
export class NGXLoggerConfigEngineFactoryMock implements INGXLoggerConfigEngineFactory {

  provideConfigEngine(config: INGXLoggerConfig): INGXLoggerConfigEngine {
    return new NGXLoggerConfigEngineMock();
  }

}
