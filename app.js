'use strict'

let express    = require('express')
let Session    = require('express-session')
let bodyParser = require('body-parser')
let mongoose   = require('mongoose')
let uuid       = require('node-uuid')
let _          = require('lodash')
let async      = require('async')
let google     = require('googleapis')
let jwt        = require('jsonwebtoken')
let exec       = require('child_process').exec

let plus       = google.plus('v1')
let OAuth2     = google.auth.OAuth2
let clientId   = require('./secret').clientId
let gSecret    = require('./secret').gSecret
let redirect   = require('./secret').redirect
let secret     = require('./secret').secret

let Playlist   = require('./models/playlist.js')
let Song       = require('./models/song.js')
let User       = require('./models/user.js')

require('./connect')()
mongoose.Promise = require('bluebird')

let app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
  new Promise((resolve, reject) => {
    jwt.verify(req.body.token, secret, (err, resp) => {
      if (err) reject(err)
      resolve(resp)
    })
  })
  .then((resp) => {
    User.findOne({ _id: resp.id }, (err, user) => {
      if (user === null) {
        res.status(200).json()
        return
      }
      console.log()
      if (user.playlists.length == 0) {
        res.status(200).json(user)
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
})

app.post('/register', (req, res) => {
  let user = req.body
  user._id = uuid.v1()
  User.findOne({username: user.username}, (err, existingUser) => {
    User.create(user, (err, user) => {
      res.status(200).json(user)
    })
  })
})

app.post('/user/:id/playlist', (req, res) => {
  let id = req.params.id
  let playlist = req.body
  playlist._id = uuid.v1()
  Playlist.create(playlist, (err, playlist) => {
    if (err) console.log(err)
    User.findOneAndUpdate(
      {_id: id},
      {$push: {playlists: playlist._id}},
      {new: true},
      (err, user) => {
        if (err) console.log(err)
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
    {name: playlist.name},
    {new: true},
    (err, playlist) => {
      if (err) {
        console.log(err)
        res.status(400).json()
        return
      }
      res.status(200).json()
    }
  )
})

app.get('/auth/google/request', (req, res) => {
  let oauthclient = new OAuth2(clientId, gSecret, redirect)
  let url = oauthclient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
  })
  res.redirect(url)
})

app.get('/auth/google/callback', (req, res) => {
  let id = uuid.v1()
  let email = ''
  let oauthclient = new OAuth2(clientId, gSecret, redirect)
  new Promise((resolve, reject) => {
    oauthclient.getToken(req.query.code, (err, tokens) => {
      if (err) reject(err)
      resolve(tokens)
    })
  })
  .then((tokens) => {
    oauthclient.setCredentials(tokens)
    return new Promise((resolve, reject) => {
      plus.people.get({ userId: 'me', auth: oauthclient }, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  })
  .then((data) => {
    email = data.emails[0].value
    return User.findOne({ username: email })
  })
  .then((doc) => {
    if (doc === null) {
      let user = new User({ _id: id, username: email, playlists: [] })
      return user.save()
    } else {
      id = doc.id
      return true
    }
  })
  .then((resp) => {
    let token = jwt.sign({ id: id }, secret)
    res.redirect('/?token=' + token)
  })
  .catch((err) => {
    console.error(err)
    res.redirect('/error')
  })
})

app.get('/error', (req, res) => {
  res.send('Sorry, something went wrong. Redirecting to homepage in a few seconds.<script>setTimeout(() => { window.location.replace("/") }, 5000)</script>')
})

app.listen(7070, (err) => {
  if (err) console.error(err)
  console.log('Listening on port 7070')
})
