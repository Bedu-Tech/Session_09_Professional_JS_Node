'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var {storage} = require('../../lib')
var uuid = require('uuid/v4')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res) {
  var users = storage.getUsers()
  return res.json({
    data: users
  })
})

router.post('/new/:username', function (req, res) {
  if (!req.body.first_name) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'Not first name provided'
    })
  }

  if (!req.body.last_name) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'Not last name provided'
    })
  }

  var userName = req.params.username
  var userExist = storage.userExist(userName)
  
  if (userExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The username ' + userName + ' already exists'
    })
  }

  var users = storage.getUsers()
  var newUser = {
    _id: uuid(),
    username: userName,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    sex: (!req.body.sex) ? null : req.body.sex
  }
  storage.saveUser(users, newUser)
  return res.json({
    success: true,
    messages: 'User created successfully',
    user: newUser
  })
})

module.exports = router
