// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MessageThread {
  ts: number;
  messages: Array<any>;
  constructor(ts: number) {
    this.ts = ts;
    /** @type {any[]} */
    this.messages = [];
  }
  appendMessage(message: any) {
    this.messages.push(message);
  }
  getFlattenMessages() {
    return this.messages.map((m: any) => { return m.values(); });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Message {
  ts: string;
  user: string;
  text: string;

  constructor(ts: string, user: string, text: string) {
    this.ts = ts;
    this.user = user;
    this.text = text;
  }
  values() {
    return [this.ts, this.user, this.text];
  }
}
