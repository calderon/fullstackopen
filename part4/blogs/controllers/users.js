const { SALT_ROUNDS } = require('../utils/config')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      id: 1
    })
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

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.sendStatus(204).end()
})

module.exports = usersRouter
