// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Crawler {
  slackClient: slack.APIClient;
  converter: Converter;

  constructor(slackAPIToken: string) {
    this.slackClient = new slack.APIClient(slackAPIToken);
    this.converter = new Converter(this.slackClient);
  }

  crawl(channel: string, from: number, to: number): MessageThread[] {
    let hasMore = true;
    let cursor: string | null = null;
    const messages: Array<any> = [];
    while (hasMore) {
      const history = this.slackClient.fetchConversationsHistory(channel, from, to, 200, cursor);
      Array.prototype.push.apply(messages, history.messages);
      if (history.hasOwnProperty('response_metadata') && history.response_metadata.hasOwnProperty('next_cursor')) {
        cursor = history.response_metadata.next_cursor;
      }
      hasMore = history.hasOwnProperty('has_more') && history.has_more;
    }
    return messages.flatMap((m: any) => {
      if (m.type !== 'message' || m.hasOwnProperty('subtype')) {
        return [];
      }
      const thread = new MessageThread(m.ts);
      const replies = this.slackClient.fetchConversationsReplies(channel, m.ts);
      replies.messages.map((r: any) => {
        thread.appendMessage(new Message(
          this.converter.convertTimestamp(r.ts),
          this.converter.convertUserName(r.user),
          this.converter.convertText(r.text)
        ));
      });
      return [thread];
    }).sort((a: MessageThread, b: MessageThread) => { return a.ts - b.ts; }); // oldest first
  }
}
