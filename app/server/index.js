'use strict'

// Instance for express
var express = require('express')
var app = express()

// Features
var users = require('../features/users')
var devices = require('../features/devices')

app.use('/users', users)
app.use('/devices', devices)

module.exports = app
