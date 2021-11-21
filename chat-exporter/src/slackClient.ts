// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SlackClient {
  constructor(token) {
    this.token = token;
  }

  fetchConversationsList(cursor: string = null, limit = 200): any {
    const params = { 'exclude_archived': true, 'limit': limit };
    if (cursor) {
      params.cursor = cursor;
    }
    const res = this.request('conversations.list', params);
    return res;
  }

  fetchConversationsHistory(channel: string, oldest: number = null, latest: number = null, limit = 200, cursor: string = null): any {
    const params = { 'channel': channel, 'limit': limit };
    if (oldest) {
      params.oldest = oldest;
    }
    if (latest) {
      params.latest = latest;
    }
    if (cursor) {
      params.cursor = cursor;
    }
    const res = this.request('conversations.history', params);
    return res;
  }

  fetchConversationsReplies(channel: string, ts: string): any {
    const res = this.request('conversations.replies', { 'channel': channel, 'ts': ts });
    return res;
  }

  fetchUser(userId: string): any {
    const params = { 'user': userId };
    const res = this.request('users.info', params);
    return res;
  }

  request(apiName: string, params: any, options: any = {}): any {
    options.headers = { 'Authorization': `Bearer ${this.token}` };
    const url = this.buildURL(apiName, params);
    for(;;) {
      const res = UrlFetchApp.fetch(url, options);
      if (res.getResponseCode() == 429) {
        Utilities.sleep(10000);
        continue;
      }
      if (res.getResponseCode() !== 200) {
        throw new Error(res.getContentText());
      }
      return JSON.parse(res.getContentText());
    }
  }

  buildURL(name: string, params: any): string {
    const queryStr = [];
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        queryStr.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
      }
    }
    const url = `https://slack.com/api/${name}?${queryStr.join('&')}`;
    return url;
  }
}
