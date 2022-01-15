import { Injectable } from '@angular/core';
import { INGXLoggerConfig } from 'src/lib/config/iconfig';
import { INGXLoggerConfigEngine } from 'src/lib/config/iconfig-engine';
import { INGXLoggerConfigEngineFactory } from 'src/lib/config/iconfig-engine-factory';
import { NGXLoggerConfigEngineMock } from './config-engine.mock';

@Injectable()
export class NGXLoggerConfigEngineFactoryMock implements INGXLoggerConfigEngineFactory {

  provideConfigEngine(config: INGXLoggerConfig): INGXLoggerConfigEngine {
    return new NGXLoggerConfigEngineMock();
  }

}
