/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace slack {
  interface params {
    [key: string]: any
  }
  export class APIClient {
    token: string
    constructor(token: string) {
      this.token = token;
    }

    archiveConversation(channel: string): any {
      const params = { 'channel': channel };
      const res = this.request('conversations.archive', params);
      return res;
    }

    renameConversation(channel: string, newName: string): any {
      const params = { 'channel': channel, 'name': newName };
      const res = this.request('conversations.rename', params);
      return res;
    }

    fetchConversationsList(cursor: string | null = null, limit = 200): any {
      const params: params = { 'exclude_archived': true, 'limit': limit };
      if (cursor) {
        params.cursor = cursor;
      }
      const res = this.request('conversations.list', params);
      return res;
    }

    fetchConversationsHistory(channel: string, oldest: number | null = null, latest: number | null = null, limit = 200, cursor: string | null = null): any {
      const params: params = { 'channel': channel, 'limit': limit };
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
      options.headers = { 'Authorization': `Bearer ${this.token}` }
      options.muteHttpExceptions = true;
      const url = this.buildURL(apiName, params)
      for (; ;) {
        const res = UrlFetchApp.fetch(url, options);
        if (res.getResponseCode() === 429) {
          Utilities.sleep(10000);
          continue
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
}
