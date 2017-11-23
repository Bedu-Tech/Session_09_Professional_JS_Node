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

module.exports = {
  getUsers,
  saveUser,
  userExist,
  userFind,
  getDevices,
  saveDevice
}
