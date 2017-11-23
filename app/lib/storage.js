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

module.exports = {
  getUsers,
  saveUser
}
