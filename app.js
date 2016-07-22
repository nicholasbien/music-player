'use strict'

let express  = require('express')
let mongoose = require('mongoose')
let uuid     = require('node-uuid')
let _        = require('lodash')
let exec     = require('child_process').exec;
let Playlist = require('./models/playlist.js')
let Song     = require('./models/song.js')
let User     = require('./models/user.js')

require('./connect')()
mongoose.Promise = require('bluebird')

let app = express()
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname, 'public/index.html')
})

app.get('/search', (req, res) => {
  var cmd = 'youtube-dl -x -g -4 --no-cache-dir --no-warnings ' + req.query.url
  exec(cmd, (error, stdout, stderr) => {
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
