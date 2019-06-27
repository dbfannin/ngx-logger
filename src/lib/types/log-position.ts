export class LogPosition {
  constructor(
    public fileName: string,
    public lineNumber: number,
    public columnNumber: number
  ) {}
  toString() {
    return this.fileName + ':' + this.lineNumber + ':' + this.columnNumber;
  }
}
