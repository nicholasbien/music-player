'use strict'

let mongoose = require('mongoose')

let SongSchema = mongoose.Schema({
  _id: String,
  title: String,
  length: String,
  artist: String,
  url: String
})

module.exports = mongoose.model('Song', SongSchema, 'songs')
