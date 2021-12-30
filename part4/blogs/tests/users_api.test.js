const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeAll(async () => {
  await User.deleteMany({})

  let userObjects = helper.initialUsers
    .map(async (user) => {
      user.passwordHash = await bcrypt.hash(user.password, 10)

      return new User(user)
    })

  userObjects = await Promise.all(userObjects)

  const userCreationPromises = userObjects.map(user => user.save())

  await Promise.all(userCreationPromises)
})

describe('GET', () => {
  it('returns all users', async () => {
    const response = await api.get('/api/users')

    expect(response.body)
      .toHaveLength(helper.initialUsers.length)
  })

  it('users are returned in json format', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('a user is within returned users', async () => {
    const response = await api.get('/api/users')

    const usernamesFromDb = response.body.map(user => user.username)

    expect(usernamesFromDb)
      .toContain(helper.initialUsers[0].username)
  })
})

describe('POST', () => {
  it('succeeds with valid data', async () => {
    const userData = {
      name: 'Test user',
      username: 'username',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let usersAfterPost = await helper.usersInDb()

    expect(usersAfterPost)
      .toHaveLength(helper.initialUsers.length + 1)

    expect(usersAfterPost.map(b => b.username))
      .toContain(userData.username)
  })

  it('fails with invalid data', async () => {
    const userData = {
      name: 'Invalid user'
    }

    await api
      .post('/api/users')
      .send(userData)
      .expect(400)

    userData.username = 'Invalid user'

    await api
      .post('/api/users')
      .send(userData)
      .expect(400)

    userData.password = 'nowisvalid'

    await api
      .post('/api/users')
      .send(userData)
      .expect(201)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
