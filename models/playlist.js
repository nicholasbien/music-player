'use strict'

let mongoose = require('mongoose')

let PlaylistSchema = mongoose.Schema({
  name: String,
  songs: [String]
})

module.exports = mongoose.model('Playlist', PlaylistSchema, 'playlists')
