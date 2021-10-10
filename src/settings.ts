// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Settings {
  fromDate: Date;
  fromTs: number;
  toDate: Date;
  toTs: number;
  originalToDate: Date;
  channel: string;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    const fromDate = new Date(this.findValue(sheet, 'FROM'));
    fromDate.setHours(0, 0, 0, 0);
    this.fromDate = fromDate;
    this.fromTs = Math.floor(this.fromDate.getTime() / 1000);

    const toDate = new Date(this.findValue(sheet, 'TO'));
    this.orignalToDate = new Date(toDate);
    toDate.setDate(toDate.getDate() + 1);
    toDate.setHours(0, 0, 0, 0);
    this.toDate = toDate;
    this.toTs = Math.floor(this.toDate.getTime() / 1000);

    this.channel = this.findValue(sheet, 'CHANNEL');
    this.appToken = this.findValue(sheet, 'APPTOKEN');
  }

  getSheetName() {
    const format = (dt) => { return dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate() };
    return format(this.fromDate) + '-' + format(this.orignalToDate);
  }

  findValue(sheet: GoogleAppsScript.Spreadsheet.Sheet, key: string): string {
    const range = sheet.createTextFinder(key).matchEntireCell(true).findNext();
    return range.offset(0, 1).getValue();
  }
}
