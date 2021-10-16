// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Crawler {
  slackClient: SlackClient;
  converter: Converter;

  constructor(slackAPIToken: string): void {
    this.slackClient = new SlackClient(slackAPIToken);
    this.converter = new Converter(this.slackClient);
  }

  crawl(channel: string, from: number, to: number): MessageThread[] {
    let hasMore = true;
    let cursor: string = null;
    const messages: Array = [];
    while (hasMore) {
      const history = this.slackClient.fetchConversationsHistory(channel, from, to, cursor);
      Array.prototype.push.apply(messages, history.messages);
      if(history.hasOwnProperty('response_metadata') && history.response_metadata.hasOwnProperty('next_cursor')) {
        cursor = history.response_metadata.next_cursor;
      }
      hasMore = history.hasOwnProperty('has_more') && history.has_more;
    }
    return messages.flatMap((m) => {
      if (m.type !== 'message' || m.hasOwnProperty('subtype')) {
        return [];
      }
      const thread = new MessageThread(m.ts);
      const replies = this.slackClient.fetchConversationsReplies(channel, m.ts);
      replies.messages.map((r) => {
        thread.appendMessage(new Message(
          this.converter.convertTimestamp(r.ts),
          this.converter.convertUserName(r.user),
          this.converter.convertText(r.text)
        ));
      });
      return [thread];
    }).sort((a, b) => { return a.ts - b.ts; }); // oldest first
  }
}
