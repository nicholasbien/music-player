'use strict'

let express  = require('express')
let mongoose = require('mongoose')
let exec     = require('child_process').exec;

let app = express()
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname, 'public/index.html')
})

app.get('/search', (req, res) => {
  var cmd = 'youtube-dl -x -g -4 --no-cache-dir --no-warnings ' + req.query.url
  exec(cmd, function(error, stdout, stderr) {
    if (stderr) {
      res.status(400).json(stderr)
    } else {
      var streamUrl = stdout.replace(/(\r\n|\n|\r)/gm,"")
      res.status(200).json(streamUrl)
    }
  })
})

app.listen(7070, (err) => {
  if (err) console.error(err)
  console.log('Listening on port 7070')
})
