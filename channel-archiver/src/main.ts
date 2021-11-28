// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const client: slack.APIClient = new slack.APIClient(properties.SLACK_APP_TOKEN);
  const channels: Array<any> = [];
  const deleteBefore: Date = new Date();
  const year: number = deleteBefore.getFullYear() - 2;
  deleteBefore.setFullYear(year)

  let cursor: string | null = null;
  for (; ;) {
    const res = client.fetchConversationsList(cursor);
    Array.prototype.push.apply(channels, res.channels)
    cursor = res.response_metadata.next_cursor;
    if (cursor === '') {
      break;
    }
  }
  channels.forEach(c => {
    const res = client.fetchConversationsHistory(c.id, null, null, 1);
    console.log(res);
    if (c.num_members == 0 || res.messages[0].ts <= deleteBefore) {
      //client.archiveConversation(c.id);
      console.log("Archived " + c.name);
    }
  });
}
