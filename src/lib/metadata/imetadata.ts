import { NgxLoggerLevel } from "../types/logger-level.enum";

/**
 * Content to be logged and some metadata
 */
export interface INGXLoggerMetadata {
  /* Content sent by the user*/

  /** The message sent to the log function
   * 
   * If a function was sent, the function is already called
  */
  message?: any;
  /** The additional params sent to the log function */
  additional?: any[];

  /* Metadata around content */
  level: NgxLoggerLevel;
  timestamp?: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}
