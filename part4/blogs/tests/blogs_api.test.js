const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')

const config = require('../utils/config')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = await new User(helper.initialUsers[0]).save()
  token = jwt.sign({
    username: user.username,
    id: user.id
  }, config.SECRET)

  const blogObjects = helper.initialBlogs
    .map(blog => {
      blog.user = user.id

      return new Blog(blog)
    })

  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned notes', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain(
      'React patterns'
    )
  })

  test('a blog has an id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    expect(blog.id).toBeDefined()
  })
})

describe('POST /api/blogs Unauthorized', () => {
  test('fails', async () => {
    const response = await api
      .post('/api/blogs/')
      .send({})
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('token missing or invalid')
  })
})

describe('POST /api/blogs Authorized', () => {
  test('succeeds with valid data', async () => {
    const blog = {
      title: 'Daniel Calderon Blog',
      author: 'Daniel Calderon',
      url: 'http://danielcalderon.dev/blog',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allNotes = await helper.blogsInDb()

    expect(allNotes)
      .toHaveLength(helper.initialBlogs.length + 1)

    expect(allNotes.map(b => b.title))
      .toContain(blog.title)
  })

  test('a new blog has zero likes by default', async () => {
    const blog = {
      title: 'Daniel Calderon Blog',
      author: 'Daniel Calderon',
      url: 'http://danielcalderon.dev/blog'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog)

    expect(response.body.likes).toBe(0)
  })

  test('a new blog contains title and url', async () => {
    const invalidBlog = {
      author: 'Daniel Calderon'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    invalidBlog.title = 'Title'

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    invalidBlog.url = 'http://danielcalderon.dev/blog'

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(201)
  })
})

describe('DELETE /api/blogs/:id Unauthorized', () => {
  test('fails', async () => {
    const blogsBeforeDelete = await helper.blogsInDb()
    const blogToDelete = blogsBeforeDelete[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('token missing or invalid')
  })
})

describe('DELETE /api/blogs/:id Authorized', () => {
  test('succeeds if id is valid', async () => {
    const blogsBeforeDelete = await helper.blogsInDb()
    const blogToDelete = blogsBeforeDelete[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()

    expect(blogsAfterDelete).toHaveLength(blogsBeforeDelete.length - 1)
  })
})

describe('UPDATE /api/blogs/:id', () => {
  test('succeeds if id is valid', async () => {
    let blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        likes: 999
      })
      .expect(200)

    blogs = await helper.blogsInDb()
    expect(blogs[0].likes).toBe(999)
  })

  test('fails if id is invalid', async () => {
    await api
      .put('/api/blogs/0')
      .send({
        likes: 999
      })
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
