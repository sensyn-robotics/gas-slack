// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const client: SlackClient = new SlackClient(properties.SLACK_APP_TOKEN);
  const channels = [];
  let cursor:string = null;
  for(;;) {
    const res = client.fetchConversationsList(cursor);
    Array.prototype.push.apply(channels, res.channels)
    cursor = res.response_metadata.next_cursor;
    if(cursor === '') {
      break;
    }
  }
  const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive();
  let targetSheet: GoogleAppsScript.Spreadsheet.Sheet = ss.getSheetByName('channels');
  if (!targetSheet) {
    targetSheet = ss.insertSheet('channels');
  }
  targetSheet.clear()
  const dc: DatetimeConverter = new DatetimeConverter();
  channels.forEach(c => {
    const res = client.fetchConversationsHistory(c.id, null, null, 1);
    console.log(res);
    targetSheet.appendRow([c.name, c.num_members, dc.convert(c.created), dc.convert(res.messages[0].ts)])
  });
}
