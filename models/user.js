'use strict'

let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  _id: String,
  username: { type: String, unique: true },
  playlists: [String]
})

module.exports = mongoose.model('User', UserSchema, 'users')
