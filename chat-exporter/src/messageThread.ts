// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MessageThread {
  constructor(ts) {
    this.ts = ts;
    /** @type {any[]} */
    this.messages = [];
  }
  appendMessage(message) {
    this.messages.push(message);
  }
  getFlattenMessages() {
    return this.messages.map((m) => { return m.values(); });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Message {
  constructor(ts, user, text) {
    this.ts = ts;
    this.user = user;
    this.text = text;
  }
  values() {
    return [this.ts, this.user, this.text];
  }
}
