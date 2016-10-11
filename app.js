'use strict'

let express    = require('express')
let bodyParser = require('body-parser')
let mongoose   = require('mongoose')
let uuid       = require('node-uuid')
let google     = require('googleapis')
let jwt        = require('jsonwebtoken')
let request    = require('request-promise')
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

app.post('/addPlaylist', (req, res) => {
  let playlist = { _id: uuid.v1(), name: req.body.name, songs: [] }
  let queryUser = User.update(
    { _id: req.body.id },
    { $push: { playlists: playlist._id } }
  )
  return Promise.all([queryUser, Playlist.create(playlist)])
  .then((status) => {
    if (status[0].ok === 1 && status[0].nModified === 1) {
      res.status(200).json(playlist)
    } else {
      res.status(500).send(false)  
    }
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send(false)
  })
})

app.post('/deletePlaylist', (req, res) => {
  let queryUser = User.update(
    { _id: req.body.id },
    { $pull: { playlists: req.body.playlistId }}
  )
  let queryPlaylist = Playlist.remove(
    { _id: req.body.playlistId }
  )
  return Promise.all([queryUser, queryPlaylist])
  .then((status) => {
    res.status(200).send(true)
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send(false)
  })
})

app.post('/renamePlaylist', (req, res) => {
  return Playlist.update(
    { _id: req.body.playlistId },
    { $set: { name: req.body.name }}
  )
  .then((status) => {
    if (status.ok === 1 && status.nModified === 1) {
      res.status(200).send(true)
    } else {
      res.status(500).send(false)
    }
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send(false)
  })
})

app.post('/addSong', (req, res) => {
  let song = { _id: uuid.v1(), title: req.body.title, artist: req.body.artist, url: req.body.url }
  let cmd = COMMAND + song.url
  exec(cmd, (error, stdout, stderr) => {
    if (stderr) {
      res.status(500).send(false)
    } else {
      song.streamUrl = stdout.replace(/(\r\n|\n|\r)/gm,"")
      let queryPlaylist = Playlist.update(
        { _id: req.body.playlistId }, 
        { $push: { songs: song._id }},
        { new: true }
      )
      return Promise.all([queryPlaylist, Song.create(song)])
      .then((status) => {
        if (status[0].ok === 1 && status[0].nModified === 1) {
          res.status(200).json(song)
        } else {
          res.status(500).send(false)  
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send(false)
      })
    }
  })
})

app.post('/deleteSong', (req, res) => {
  return Playlist.update(
    { _id: req.body.playlistId },
    { $pull: { songs: req.body.songId }}
  )
  .then((status) => {
    if (status.ok === 1 && status.nModified === 1) {
      res.status(200).json(true)
    } else {
      res.status(500).send(false)  
    }
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send(false)
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
    return User.findOne({ _id: resp.id }).lean()
  })
  .then((user) => {
    if (user === null) {
      res.status(500).send(false)
      return null
    }
    if (user.playlists.length == 0) {
      res.status(200).json(user)
      return null
    }
    return getUserMusic(user)
  })
  .then((user) => {
    if (user !== null) {
      res.status(200).json(user)
    }
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send(false)
  })
})

let getUserMusic = (user) => {
  let playlistQueries = []
  user.playlists.forEach((playlist) => {
    playlistQueries.push(Playlist.findOne({ _id: playlist }).lean())
  })
  return Promise.all(playlistQueries)
  .then((playlists) => {
    playlists.forEach((playlist, index) => {
      user.playlists[index] = playlist  
      user.playlists[index].songs = getUserSongs(playlist.songs)
      return user
    })
    //return user
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2))
  })
}

let getUserSongs = (songs) => {
  let songQueries = []
  songs.forEach((song) => {
    songQueries.push(Song.findOne({ _id: song }).lean())
  })
  return Promise.all(songQueries)
  .then((songInfo) => {
    return songInfo
  })
}

let test = { "_id" : "106134473799137240152", "username" : "Vlad Chilom", "playlists" : [ "f93c0a40-7176-11e6-936f-4dbb7876c631", "fb85ac20-7176-11e6-936f-4dbb7876c631" ] }
getUserMusic(test)
.catch((err) => {
  console.log(err)
})

app.get('/auth/google/request', (req, res) => {
  let oauthclient = new OAuth2(clientId, gSecret, redirect)
  let url = oauthclient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile'
  })
  res.redirect(url)
})

app.get('/auth/google/callback', (req, res) => {
  let id, username, googleToken
  let oauthclient = new OAuth2(clientId, gSecret, redirect)
  
  new Promise((resolve, reject) => {
    oauthclient.getToken(req.query.code, (err, tokens) => {
      if (err) reject(err)
      resolve(tokens)
    })
  })
  .then((tokens) => {
    googleToken = tokens.access_token
    oauthclient.setCredentials(tokens)
    return new Promise((resolve, reject) => {
      plus.people.get({ userId: 'me', auth: oauthclient }, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  })
  .then((data) => {
    id = data.id
    username = data.displayName
    return User.findOne({ _id: data.id })
  })
  .then((doc) => {
    if (doc === null) {
      let user = new User({ _id: id, username: username, playlists: [] })
      return user.save()
    }
    return true
  })
  .then((resp) => {
    return request('https://accounts.google.com/o/oauth2/revoke?token=' + googleToken)
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
