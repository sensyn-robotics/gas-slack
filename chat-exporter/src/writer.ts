// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Writer {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  currentRow: number;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
    this.sheet = sheet;
    this.currentRow = 1;
  }

  write(threads: MessageThread[]): void {
    threads.forEach((t) => {
      const messages = t.getFlattenMessages();
      this.sheet.getRange(this.currentRow, 1, messages.length, 3).setValues(messages);
      if (messages.length > 1) {
        this.sheet.getRange(this.currentRow + 1, 1, messages.length - 1, 3).shiftRowGroupDepth(1);
      }
      this.currentRow += messages.length;
    });
  }
}