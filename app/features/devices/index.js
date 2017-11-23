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

router.post('/share', function (req, res) {
  if (!req.body.owner) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The owner field not provided'
    })
  }

  if (!req.body.device) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The device field not provided'
    })
  }

  if (!req.body.shareWith) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The shareWith field not provided'
    })
  }

  var owner = req.body.owner
  var device = req.body.device
  var userShareWith = req.body.shareWith

  var userExist = storage.userExist(owner)
  
  if (!userExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The user ' + owner + ' not exist'
    })
  }

  var smartLockExist = storage.deviceExist(device)
  
  if (!smartLockExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The smartlock ' + device + ' not exist'
    })
  }

  var userShareExist = storage.userExist(userShareWith)
  
  if (!userShareExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The user for share ' + usershareWith + ' not exist'
    })
  }

  var userHasAccess = storage.userHasAccessToDevice(owner, device)
  
  if (!userHasAccess) {
    return res.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized'
    })
  }

  var userShareHasAccess = storage.userHasAccessToDevice(userShareWith, device)

  if (userShareHasAccess) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The user ' + userShareWith + ' already has access'
    })
  }

  storage.addAccessToDevice(userShareWith, device)

  return res.json({
    success: true,
    message: 'Device shared successfully'
  })
})

router.post('/status', function (req, res) {
  if (!req.body.owner) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The owner field not provided'
    })
  }

  if (!req.body.device) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The device field not provided'
    })
  }

  if (typeof req.body.locked == 'undefined') {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The locked field not provided'
    })
  }

  var owner = req.body.owner
  var smartLockName = req.body.device
  var smartLockStatus = req.body.locked
  
  var userExist = storage.userExist(owner)
  
  if (!userExist) {
    return res.status(400).send({
      statusCode: 400,
      error: 'Bad request',
      message: 'The user ' + owner + ' not exist'
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

  var userHasAccess = storage.userHasAccessToDevice(owner, smartLockName)

  if (!userHasAccess) {
    return res.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized'
    })
  }

  storage.updateDeviceStatus(smartLockStatus, smartLockName)

  return res.json({
    success: true,
    message: 'The smarlock status has changed successfully',
    status: (smartLockStatus) ? 'locked' : 'unlocked'
  })
})

module.exports = router
