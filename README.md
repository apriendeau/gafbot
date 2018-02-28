## GAFBOT

1. To install this project locally, at this project root run `npm install`

2. To start the service, at this project root run `node index.js` with the correct environment variables.

  * Then publish this service by using ngrok

      1. First install ngrok, then at this project root run ngrok http 3000

      2. Once you see the generated temp url, similar to 'http://a12e4960.ngrok.io', change the url in all three places into generated temp url:

          https://api.slack.com/apps/A97SVMZ44/oauth

          https://api.slack.com/apps/A97SVMZ44/slash-commands

Environment Variables Needed:
* `OAUTH_TOKEN`
* `SLACK_TOKEN`
* `PORT` (defaults to 3000)
* `NODE_ENV` (defaults to `development`)
