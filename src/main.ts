// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
  const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive();

  const mainSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.getSheetByName('settings');
  const settings: Settings = new Settings(mainSheet);

  const threads: MessageThread[] = new Crawler(settings.appToken).crawl(settings.channel, settings.fromTs, settings.toTs);
  const newSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.insertSheet(settings.getSheetName());

  new Writer(newSheet).write(threads);
}
