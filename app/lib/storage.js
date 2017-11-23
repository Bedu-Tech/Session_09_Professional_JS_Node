'use strict'

var persist = require('./persist')

/**
 * Function to get users from storage
 * @return Array
 */
var getUsers = function () {
  var users = persist.getItemSync('users')
  if (typeof users == 'undefined') {
    users = []
  }
  return users
}

/**
 * Function to known if user exist in storage
 * @param {String} userName
 * @return Boolean
 */
var userExist = function (userName) {
  var exist = false
  var users = persist.getItemSync('users')
  if (typeof users == 'undefined') {
    users = []
  }
  users.map(function (user) {
    if (user.username === userName) {
      exist = true
    }
  })

  return exist
}

/**
 * Function to get user by username
 * @param {String} userName
 * @return Object
 */
var userFind = function (userName) {
  var matchedAccount
  var users = persist.getItemSync('users')
  if (typeof users == 'undefined') {
    users = []
  }
  users.map(function (user) {
    if (user.username === userName) {
      matchedAccount = user
    }
  })

  return matchedAccount
}

/**
 * Function for save user to storage
 * @param {Array} users
 * @param {Object} newUser
 * @return Array
 */
var saveUser = function (users, newUser) {
  users.push(newUser)
  persist.setItemSync('users', users)
  return users
}

/**
 * Function to get devices from storage
 * @return Array
 */
var getDevices = function () {
  var devices = persist.getItemSync('devices')
  if (typeof devices == 'undefined') {
    devices = []
  }
  return devices
}

/**
 * Function to save device to storage
 * @param {Array} devices 
 * @param {Object} newDevice 
 */
var saveDevice = function (devices, newDevice) {
  devices.push(newDevice)
  persist.setItemSync('devices', devices)
  return devices
}

/**
 * Function to known if device exist in storage
 * @param {String} deviceName
 * @return Boolean
 */
var deviceExist = function (deviceName) {
  var exist = false
  var devices = persist.getItemSync('devices')
  if (typeof devices == 'undefined') {
    devices = []
  }
  devices.map(function (device) {
    if (device.name === deviceName) {
      exist = true
    }
  })

  return exist
}

/**
 * Function to get device by name
 * @param {String} deviceName 
 * @return Object
 */
var deviceFind = function (deviceName) {
  var matchedDevice
  var devices = persist.getItemSync('devices')
  if (typeof devices == 'undefined') {
    devices = []
  }
  devices.map(function (device) {
    if (device.name === deviceName) {
      matchedDevice = device
    }
  })

  return matchedDevice
}

/**
 * Function to share device with other user
 * @param {String} userName 
 * @param {String} deviceName 
 * @return void
 */
var addAccessToDevice = function (userName, deviceName) {
  var matchedDevice
  var indexDevice

  var devices = getDevices()
  devices.map(function (device, index) {
    if (device.name === deviceName) {
      matchedDevice = device
      indexDevice = index
    }
  })
  var newAccess = {
    user: userName
  }
  matchedDevice.accessTo.push(newAccess)
  matchedDevice.modifiedAt = new Date()
  devices[indexDevice] = matchedDevice

  persist.setItemSync('devices', devices)
}

/**
 * Function to known if the user has access to device
 * @param {String} userName 
 * @param {String} deviceName 
 * @return Boolean
 */
var userHasAccessToDevice = function (userName, deviceName) {
  var hasAccess = false
  var device = deviceFind(deviceName)
  var usersWithAccess = device.accessTo
  usersWithAccess.map(function (access) {
    if (access.user === userName) {
      hasAccess = true
    }
  })

  return hasAccess
}

module.exports = {
  getUsers,
  saveUser,
  userExist,
  userFind,
  getDevices,
  saveDevice,
  deviceExist,
  deviceFind,
  userHasAccessToDevice,
  addAccessToDevice
}
