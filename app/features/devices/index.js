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
  var deviceExist = storage.deviceExist(deviceName)

  if (deviceExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'This device name already exist'
    })
  }

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

router.get('/status/:username/:smartlockname', function (req, res) {
  var userName = req.params.username
  var smartLockName = req.params.smartlockname
  
  var userExist = storage.userExist(userName)
  
  if (!userExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The user ' + userName + ' not exist'
    })
  }

  var smartLockExist = storage.deviceExist(smartLockName)

  if (!smartLockExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The smartlock ' + smartLockName + ' not exist'
    })
  }

  var userHasAccess = storage.userHasAccessToDevice(userName, smartLockName)

  if (!userHasAccess) {
    return res.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized'
    })
  }

  var device = storage.deviceFind(smartLockName)

  return res.send({
    status: (device.locked) ? 'locked' : 'unlocked'
  })
})

module.exports = router
