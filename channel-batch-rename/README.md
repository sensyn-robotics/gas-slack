# channel-batch-rename
## What's this
* Rename slack channels

## How to use

* Push GAS to your project
```
> clasp login
> clasp create hoge --rootDir ./src
? Create which script? sheets
Created new Google Sheet: https://drive.google.com/open?id=*****
Created new Google Sheets Add-on script: https://script.google.com/d/*****
```
* Push this project
```
> clasp push
```
* Create Slack Apps
* Set OAuth access token to Project property
* Write spread sheet column 1 is original name, column 2 is modified name.
