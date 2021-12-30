const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(note => new Blog(note))
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
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

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
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

    invalidBlog.title = 'Title'

    await api
      .post('/api/blogs')
      .send(invalidBlog)
      .expect(400)

    invalidBlog.url = 'http://danielcalderon.dev/blog'

    await api
      .post('/api/blogs')
      .send(invalidBlog)
      .expect(201)
  })
})

describe('deletion of a blog', () => {
  test('succeeds if id is valid', async () => {
    const blogsBeforeDelete = await helper.blogsInDb()
    const blogToDelete = blogsBeforeDelete[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()

    expect(blogsAfterDelete).toHaveLength(blogsBeforeDelete.length - 1)
  })
})

describe('update a blog', () => {
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
