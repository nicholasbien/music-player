'use strict'

let express    = require('express')
let bodyParser = require('body-parser')
let mongoose   = require('mongoose')
let uuid       = require('node-uuid')
let _          = require('lodash')
let async      = require('async')
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
    async.forEachOf(playlist.songs, (id, index, callback) => {
      Song.findOne({_id: id}, (err, song) => {
        playlist.songs[index] = song
        callback(err)
      }, (err) => {
        res.status(200).json(playlist)
      })
    })
  })
})

app.get('/song/:id', (req, res) => {
  let id = req.params.id
  Song.findOne({_id: id}, (err, song) => {
    res.status(200).json(song)
  })
})

app.post('/login', (req, res) => {
  let user = req.body
  User.findOne({username: user.username, password: user.password}, (err, user) => {
    if (user === null) {
      res.status(200).json()
      return
    }
    if (!user.playlists) {
      res.status(200).json(user)
    }
    let playlistsProcessed = 0
    user.playlists.forEach((id, index) => {
      Playlist.findOne({_id: id}, (err, playlist) => {
        async.forEachOf(playlist.songs, (id, index, callback) => {
          Song.findOne({_id: id}, (err, song) => {
            console.log(song)
            let cmd = 'youtube-dl -x -g -4 --no-cache-dir --no-warnings ' + song.url
            exec(cmd, (error, stdout, stderr) => {
              if (stderr) {
                song.streamUrl = null
              } else {
                song.streamUrl = stdout.replace(/(\r\n|\n|\r)/gm,"")
              }
              console.log(song)
              playlist.songs[index] = song
              callback(err)
            })
          })
        }, (err) => {
          console.log(user)
          user.playlists[index] = playlist
          playlistsProcessed++
          if (playlistsProcessed === user.playlists.length) {
            res.status(200).json(user)
          }
        })
      })
    })
  })
})

app.post('/user', (req, res) => {
  let user = req.body
  User.findOne({username: user.username}, (err, existingUser) => {
    if (existingUser !== null) {
      console.log('user already registered')
      
    } else {
      user._id = uuid.v1()
      User.create(user, (err, user) => {
        res.status(200).json(user)
      })
    }
  })
})

app.post('/user/:id/playlist', (req, res) => {
  let id = req.params.id
  let playlist = req.body
  playlist._id = uuid.v1()
  console.log(playlist)
  Playlist.create(playlist, (err, playlist) => {
    if (err) console.log(err)
    User.findOneAndUpdate(
      {_id: id},
      {$push: {playlists: playlist._id}},
      (err, user) => {
        if (err) console.log(err)
        res.status(200).json(playlist)
    })
  })
})

app.post('/playlist/:id/song', (req, res) => {
  let id = req.params.id
  let song = req.body
  song._id = uuid.v1()
  Song.create(song, (err, song) => {
    if (err) console.log(err)
    Playlist.findOneAndUpdate(
      {_id: id}, 
      {$push: {songs: song._id}},
      (err, playlist) => {
        if (err) console.log(err)
        res.status(200).json(song)
    })
  })
})

app.listen(7070, (err) => {
  if (err) console.error(err)
  console.log('Listening on port 7070')
})
