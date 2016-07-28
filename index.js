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

let COMMAND = 'youtube-dl -x -g -4 --no-cache-dir --no-warnings '

app.get('/', (req, res) => {
  res.sendFile(__dirname, 'public/index.html')
})

app.get('/search', (req, res) => {
  var cmd = COMMAND + req.query.url
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

app.post('/login', (req, res) => {
  let user = req.body
  User.findOne({username: user.username, password: user.password}, (err, user) => {
    if (user === null) {
      console.log('Incorrect username/password combination')
      res.status(400).json()
      return
    }
    if (!user.playlists.length) {
      res.status(200).json(user)
      return
    }
    let playlistsProcessed = 0
    user.playlists.forEach((id, index) => {
      Playlist.findOne({_id: id}, (err, playlist) => {
        async.forEachOf(playlist.songs, (id, index, callback) => {
          Song.findOne({_id: id}, (err, song) => {
            playlist.songs[index] = song
            callback(err)
          })
        }, (err) => {
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

app.post('/register', (req, res) => {
  let user = req.body
  user._id = uuid.v1()
  User.findOne({username: user.username}, (err, existingUser) => {
    if (err) {
      console.log(err)
      res.status(400).json()
      return
    }
    if (existingUser) {
      console.log('User with username "' + user.username + '" already exists')
      res.status(400).json()
      return
    }
    User.create(user, (err, user) => {
      if (err) {
        console.log(err)
        res.status(400).json()
        return
      }
      res.status(200).json(user)
    })
  })
})

app.post('/user/:id/playlist', (req, res) => {
  let id = req.params.id
  let playlist = req.body
  playlist._id = uuid.v1()
  Playlist.create(playlist, (err, playlist) => {
    if (err) {
      console.log(err)
      res.status(400).json()
      return
    }
    User.findOneAndUpdate(
      {_id: id},
      {$push: {playlists: playlist._id}},
      {new: true},
      (err, user) => {
        if (err) {
          console.log(err)
          res.status(400).json()
          return
        }
        res.status(200).json(playlist)
      }
    )
  })
})

app.post('/playlist/:id/song', (req, res) => {
  let id = req.params.id
  let song = req.body
  song._id = uuid.v1()
  let cmd = COMMAND + song.url
  exec(cmd, (error, stdout, stderr) => {
    if (stderr) {
      res.status(400).json()
      return
    }
    song.streamUrl = stdout.replace(/(\r\n|\n|\r)/gm,"")
    Song.create(song, (err, song) => {
      if (err) {
        console.log(err)
        res.status(400).json()
        return
      }
      Playlist.findOneAndUpdate(
        {_id: id}, 
        {$push: {songs: song._id}},
        {new: true},
        (err, playlist) => {
          if (err) {
            console.log(err)
            res.status(400).json()
            return
          }
          res.status(200).json(song)
      })
    })
  })
})

app.post('/playlist/:playlistId/song/:songId/delete', (req, res) => {
  let playlistId = req.params.playlistId
  let songId = req.params.songId
  Playlist.findOneAndUpdate(
    {_id: playlistId},
    {$pull: {songs: songId}},
    {new: true},
    (err, playlist) => {
      if (err) {
        console.log(err)
        res.status(400).json()
        return
      }
      Song.remove({_id: songId}, (err) => {
        if (err) {
          console.log(err)
          res.status(400).json()
          return
        }
        res.status(200).json()
      })
    }
  )
})

app.post('/song', (req, res) => {
  let song = req.body
  let cmd = COMMAND + song.url
  exec(cmd, (error, stdout, stderr) => {
    if (stderr) {
      res.status(400).json()
      return
    }
    let streamUrl = stdout.replace(/(\r\n|\n|\r)/gm,"")
    Song.findOneAndUpdate(
      {_id: song._id},
      {streamUrl: streamUrl},
      {new: true},
      (err, song) => {
        if (err) {
          console.log(err)
          res.status(400).json()
          return
        }
        res.status(200).json(song)
      }
    )
  })
})

app.post('/user/:userId/playlist/:playlistId/delete', (req, res) => {
  let userId = req.params.userId
  let playlistId = req.params.playlistId
  User.findOneAndUpdate(
    {_id: userId},
    {$pull: {playlists: playlistId}},
    {new: true},
    (err, user) => {
      if (err) {
        console.log(err)
        res.status(400).json()
        return
      }
      Playlist.remove({_id: playlistId}, (err) => {
        if (err) {
          console.log(err)
          res.status(400).json()
          return
        }
        res.status(200).json()
      })
    }
  )
})

app.post('/playlist/:id/rename', (req, res) => {
  let id = req.params.id
  let playlist = req.body
  Playlist.findOneAndUpdate(
    {_id: id},
    {$set: {name: playlist.name}},
    {new: true},
    (err, playlist) => {
      if (err) {
        console.log(err)
        res.status(400).json()
        return
      }
      res.status(200).json(playlist)
    }
  )
})

app.listen(7070, (err) => {
  if (err) console.error(err)
  console.log('Listening on port 7070')
})
