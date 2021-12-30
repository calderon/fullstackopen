/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const SALT_ROUNDS = 10
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
  SALT_ROUNDS,
  SECRET
}
