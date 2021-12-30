const { SALT_ROUNDS } = require('../utils/config')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  if (!request.body.password) {
    response.status(400).json({
      error: 'Please, include a password'
    })
  }

  if (request.body.password.length < 3) {
    response.status(400).json({
      error: 'Password must be 3 or more characters'
    })
  }

  const passwordHash = await bcrypt.hash(request.body.password, SALT_ROUNDS)
  const userData = { ...request.body, passwordHash }
  const user = await User.create(userData)

  response.status(201).json(user)
})

module.exports = usersRouter
