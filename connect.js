'use strict'

let config   = require('config')
let mongoose = require('mongoose')
let url      = require('url')

const mongoUrl = url.format({
  host: config.get('db.host'),
  protocol: config.get('db.protocol'),
  pathname: config.get('db.pathname'),
  slashes: true
})

module.exports = () => Promise.resolve(mongoose.connect(mongoUrl))
