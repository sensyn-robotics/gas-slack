// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Crawler {
  slackClient: SlackClient;
  converter: Converter;

  constructor(slackAPIToken: string): void {
    this.slackClient = new SlackClient(slackAPIToken);
    this.converter = new Converter(this.slackClient);
  }

  crawl(channel: string, from: number, to: number): MessageThread[] {
    const history = this.slackClient.fetchConversationsHistory(channel, from, to);
    if (!Array.isArray(history.messages)) {
      return [];
    }
    return history.messages.flatMap((m) => {
      if (m.type !== 'message') {
        return [];
      }
      if (m.hasOwnProperty('subtype')) {
        return [];
      }
      const thread = new MessageThread(m.ts)
      const replies = this.slackClient.fetchConversationsReplies(channel, m.ts);
      replies.messages.map((r) => {
        thread.appendMessage(new Message(
          this.converter.convertTimestamp(r.ts),
          this.converter.convertUserName(r.user),
          this.converter.convertText(r.text)
        ));
      })
      return [thread];
    }).sort((a, b) => { return a.ts - b.ts; }) // oldest first
  }
}