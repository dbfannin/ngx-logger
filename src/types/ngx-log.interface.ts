import {LogMetaData} from './log-meta-data.interface';

export interface NGXLog {
  message: string;
  additional: any[];
  metaData: LogMetaData
}
