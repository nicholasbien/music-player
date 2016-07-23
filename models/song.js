'use strict'

let mongoose = require('mongoose')

let SongSchema = mongoose.Schema({
  _id: String,
  title: String,
  artist: String,
  url: String,
  streamUrl: String
})

module.exports = mongoose.model('Song', SongSchema, 'songs')
