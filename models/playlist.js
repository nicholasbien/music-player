'use strict'

let mongoose = require('mongoose')

let PlaylistSchema = mongoose.Schema({
  _id: String,
  name: String,
  songs: [String]
})

module.exports = mongoose.model('Playlist', PlaylistSchema, 'playlists')
