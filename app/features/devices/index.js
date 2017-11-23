'use strict'

var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var {storage} = require('../../lib')
var uuid = require('uuid/v4')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res) {
  var devices = storage.getDevices()
  return res.json({
    data: devices
  })
})

router.post('/new/:name', function (req, res) {
  if (!req.body.username) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'Not username provided to link smartlock'
    })
  }
  var userExist = storage.userExist(req.body.username)

  if (!userExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'Username provided not exist'
    })
  }

  var userName = req.body.username
  var deviceName = req.params.name
  var devices = storage.getDevices()
  var newDevice = {
    _id: uuid(),
    name: deviceName,
    accessTo: [
      {
        user: userName
      }
    ],
    locked: false,
    createdAt: new Date(),
    modifiedAt: new Date()
  }
  storage.saveDevice(devices, newDevice)
  return res.json({
    success: true,
    messages: 'Devices created successfully',
    device: newDevice
  })
})

module.exports = router
