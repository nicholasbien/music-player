'use strict'

let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  username: String,
  password: String,
  playlists: [String]
})

module.exports = mongoose.model('User', UserSchema, 'users')
