'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var {storage} = require('../../lib')
var uuid = require('uuid/v4')

router.use(bodyParser.urlencoded({ extended: true }))

/**
 * Function to get users from storage
 * @return Array
 */
var getUsers = function () {
  var users = storage.getItemSync('users')
  if (typeof users == 'undefined') {
    users = []
  }
  return users
}

/**
 * Function for save user to storage
 * @param {Array} users
 * @param {Object} newUser
 * @return Array
 */
var saveUser = function (users, newUser) {
  users.push(newUser)
  storage.setItemSync('users', users)
  return users
}

router.get('/', function (req, res) {
  var users = storage.getItemSync('users')
  res.json({
    data: users
  })
})

router.post('/new/:username', function (req, res) {
  var userName = req.params.username
  var users = getUsers()
  var newUser = {
    _id: uuid(),
    username: userName
  }
  saveUser(users, newUser)
  res.json({
    success: true,
    messages: 'User created successfully',
    user: newUser
  })
})

module.exports = router
