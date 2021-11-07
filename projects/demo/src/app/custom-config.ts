import { INGXLoggerConfig } from '../../../../src/public_api';

export interface CustomConfig extends INGXLoggerConfig {
    customProp: string;
}