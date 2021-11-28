// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const client: slack.APIClient = new slack.APIClient(properties.SLACK_APP_TOKEN);
  const channels: Array<any> = [];
  let cursor: string | null = null;
  for (; ;) {
    const res = client.fetchConversationsList(cursor);
    Array.prototype.push.apply(channels, res.channels)
    cursor = res.response_metadata.next_cursor;
    if (cursor === '') {
      break;
    }
  }
  const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive();
  const existsSheet: GoogleAppsScript.Spreadsheet.Sheet | null = ss.getSheetByName('channels');
  const targetSheet: GoogleAppsScript.Spreadsheet.Sheet = (existsSheet === null) ? ss.insertSheet('channels') : existsSheet;
  targetSheet.clear();
  const dc: DatetimeConverter = new DatetimeConverter();
  channels.forEach(c => {
    const res = client.fetchConversationsHistory(c.id, null, null, 1);
    targetSheet.appendRow([c.name, c.num_members, dc.convert(c.created), dc.convert(res.messages[0].ts)])
  });
}
