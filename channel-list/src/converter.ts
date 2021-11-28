// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Converter {
  userConverter: UserConverter;
  textConverter: TextConverter;
  datetimeConverter: DatetimeConverter;

  constructor(slackClient: slack.APIClient) {
    this.userConverter = new UserConverter(slackClient);
    this.textConverter = new TextConverter(this.userConverter);
    this.datetimeConverter = new DatetimeConverter();
  }
  convertTimestamp(ts: number): string {
    return this.datetimeConverter.convert(ts);
  }
  convertUserName(userId: string): string {
    return this.userConverter.convert(userId);
  }
  convertText(text: string): string {
    return this.textConverter.convert(text);
  }
}

class UserConverter {
  userCache: any;
  slackClient: slack.APIClient;

  constructor(slackClient: slack.APIClient) {
    this.userCache = {};
    this.slackClient = slackClient
  }

  convert(userId: string): string {
    if (this.userCache.hasOwnProperty(userId)) {
      return this.userCache[userId];
    }
    const res = this.slackClient.fetchUser(userId);
    return res.user.profile.display_name;
  }
}

class TextConverter {
  userConverter: UserConverter;

  constructor(userConverter: UserConverter) {
    this.userConverter = userConverter;
  }

  convert(text: string) {
    return text.replace(/<@U[0-9A-Z]+>/g, (match) => {
      return '@' + this.userConverter.convert(match.slice(2, -1));
    });
  }
}

class DatetimeConverter {
  convert(sec: number): string {
    return new Date(sec * 1000).toLocaleString('ja-JP');
  }
}
