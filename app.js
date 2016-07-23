'use strict'

let express    = require('express')
let bodyParser = require('body-parser')
let mongoose   = require('mongoose')
let uuid       = require('node-uuid')
let _          = require('lodash')
let exec       = require('child_process').exec

let Playlist   = require('./models/playlist.js')
let Song       = require('./models/song.js')
let User       = require('./models/user.js')

require('./connect')()
mongoose.Promise = require('bluebird')

let app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

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

app.get('/user/:id', (req, res) => {
  let id = req.params.id
  User.findOne({_id: id}, (err, user) => {
    res.status(200).json(user)
  })
})

app.get('/playlist/:id', (req, res) => {
  let id = req.params.id
  Playlist.findOne({_id: id}, (err, playlist) => {
    res.status(200).json(playlist)
  })
})

app.get('/song/:id', (req, res) => {
  let id = req.params.id
  Song.findOne({_id: id}, (err, song) => {
    res.status(200).json(song)
  })
})

app.post('/user', (req, res) => {
  let user = req.body
  User.findOne({username: user.username}, (err, user) => {
    if (user !== null) {
      console.log('username taken')
      res.status(200).json(user)
    } else {
      User.create(user, (err, user) => {
        res.status(200).json(user)
      })
    }
  })
})

app.post('/playlist', (req, res) => {
  let playlist = req.body
  Playlist.create(playlist, (err, playlist) => {
    res.status(200).json(playlist)
  })
})

app.post('/song', (req, res) => {
  let song = req.body
  Song.create(song, (err, song) => {
    if (err) console.log(err)
    res.status(200).json(song)
  })
})

app.listen(7070, (err) => {
  if (err) console.error(err)
  console.log('Listening on port 7070')
})
