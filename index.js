'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const morgan = require('morgan')
const urlRegex = require('url-regex')

const app = express();

app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

const gifImg = "https://media3.giphy.com/media/3o85xnoIXebk3xYx4Q/giphy.gif"
const gifError = "*Seriously, you don't know what the numbers 1-10 are?*\n"

const giveAF = (number, username) => {
  let message = "*" + username
  message += "'s GAF Scale*:\n"
  message += "```\n"
  message += "1 --- 2 --- 3 --- 4 --- 5 --- 6 --- 7 --- 8 --- 9 --- 10 \n"


  let i = 0
  let percent = (number * .1) - .1
  let spaceCount = Math.round(58 * percent)

  if (number >= 4 && number < 9) {
    spaceCount += 1
  }
  if (number >= 9) {
    spaceCount += 2
  }
  for (i = 0; i < spaceCount; i++) {
    message += " "
  }
  message += "^\n"
  for (i = 0; i < spaceCount; i++) {
    message += " "
  }
  message += "me\n"
  message +="```"
  return message
}
const errorResponse = (responseUrl) => {
  respond(responseUrl, {
    response_type: 'ephemeral',
    attachments: [{
      color: 'danger',
      title: 'ERROR',
      text: gifError,
      image_url: gifImg,
    }]
  })
}

const respond = (responseUrl, data) => {
  request({
    method: 'post',
    url: responseUrl,
    json: data,
    headers: {
      "content-type": "application/json",
    }
  }, function (error, response, body) {
    if (error) {
      console.log(error)
    }
  });
}


app.post("/", (req, res) => {
  if (process.env.SLACK_TOKEN != req.body.token) {
    return
  }
  const responseUrl = req.body.response_url
  const text = req.body.text
  const link = text.match(urlRegex())
  const linkToShorten = link ? link[0] : null
  const parseText = text.split(' ', 1)
  if (!parseText.length) {
    return
  }
  let i = parseFloat(text)
  if (i < 1 || i > 10) {
    errorResponse(responseUrl)
    res.json()
    return
  }

  let message = giveAF(i, req.body.user_name)

  let d = {
    response_type: "in_channel",
    text: message,
  }

  respond(responseUrl, d)
  res.json()
  return
})


app.get("/", (req, res) => {
  res.json()
})

let port = 3000
if (process.env.PORT != undefined) {
  port = parseInt(process.env.PORT)
}

const server = app.listen(port, () => {
  console.log("Services is listening on port %d in %s mode", server.address().port, app.settings.env)
})
