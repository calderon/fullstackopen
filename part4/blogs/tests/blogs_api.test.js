const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let index = 0; index < helper.initialBlogs.length; index++) {
    let blogObject = new Blog(helper.initialBlogs[index])
    await blogObject.save()
  }
})

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

test('a valid blog can be added', async () => {
  const blog = {
    title: 'Daniel Calderon Blog',
    author: 'Daniel Calderon',
    url: 'http://danielcalderon.dev/blog',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body)
    .toHaveLength(helper.initialBlogs.length + 1)

  expect(response.body.map(b => b.title))
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
    .send(blog)

  expect(response.body.likes).toBe(0)
})

test('a new blog contains title and url', async () => {
  const invalidBlog = {
    author: 'Daniel Calderon'
  }

  await api
    .post('/api/blogs')
    .send(invalidBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
