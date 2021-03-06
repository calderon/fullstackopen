const config = require('../utils/config')

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
      id: 1
    })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { token, decodedToken } = request

  if (!token || !decodedToken) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    ...request.body,
    user: user._id
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

  response.json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { token, decodedToken } = request

  if (!token || !decodedToken) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const userId = decodedToken.id
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== userId.toString()) {
    response.status(401).end()
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.sendStatus(204).end()
})

module.exports = blogsRouter
