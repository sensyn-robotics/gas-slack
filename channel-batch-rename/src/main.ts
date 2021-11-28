// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const client: slack.APIClient = new slack.APIClient(properties.SLACK_APP_TOKEN);
  const sheet: GoogleAppsScript.Spreadsheet.Sheet = SpreadsheetApp.getActive().getActiveSheet();
  const originalNamesRange: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(1, 1, 1000);
  collectChannelList(client).forEach(c => {
    const finder: GoogleAppsScript.Spreadsheet.TextFinder = originalNamesRange.createTextFinder("^" + c.name + "$").useRegularExpression(true);
    const found = finder.findNext();
    if (!found) {
      return
    }
    const candidate: string = sheet.getRange(found.getRowIndex(), 2).getValue();
    if (candidate !== "") {
      const res = client.renameConversation(c.id, candidate);
      console.log(res.channel.previous_names[0] + " -> " + res.channel.name);
    }
  });
}

function collectChannelList(client: slack.APIClient): Array<any> {
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
  return channels;
}
