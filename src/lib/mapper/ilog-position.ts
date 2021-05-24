/**
 * Position of caller
 */
export interface INGXLoggerLogPosition {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;

    // toString() {
    //     return this.fileName + ':' + this.lineNumber + ':' + this.columnNumber;
    //   }

}
