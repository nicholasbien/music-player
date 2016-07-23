'use strict'

let mongoose = require('mongoose')

let SongSchema = mongoose.Schema({
  title: String,
  artist: String,
  url: String
})

module.exports = mongoose.model('Song', SongSchema, 'songs')
