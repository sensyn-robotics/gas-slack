# chat-exporter

## How to use

* Push GAS to your project
```
> clasp login
> clasp create hoge --rootDir ./src
? Create which script? sheets
Created new Google Sheet: https://drive.google.com/open?id=*****
Created new Google Sheets Add-on script: https://script.google.com/d/*****
> clasp push
└─ src/appsscript.json
└─ src/converter.ts
└─ src/crawler.ts
└─ src/main.ts
└─ src/messageThread.ts
└─ src/settings.ts
└─ src/slackClient.ts
└─ src/writer.ts
Pushed 8 files.
```
* Create Slack Apps
* Set OAuth access token and others to `settings` sheet
