require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const Person = require('./models/person')

app.use(
  cors()
)

app.use(
  express.json()
)

app.use(
  express.static('build')
)

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(
  morgan((tokens, req, res) => {
    const buffer = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ]

    if (tokens.method(req, res) === 'POST') {
      buffer.push(
        tokens['body'](req, res)
      )
    }

    return buffer.join(' ')
  })
)

app.get('/info', async (request, response) => {
  const persons = await Person.find({})
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (err) {
    next(err)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    response.json(person)
  } catch (err) {
    next(err)
  }
})

app.post('/api/persons/', async (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  try {
    const person = new Person({
      name: body.name,
      number: body.number
    })

    const savedPerson = await person.save()
    response.json(savedPerson)
  } catch (err) {
    next(err)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const { name, number } = request.body

  try {
    const person = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )

    response.json(person)
  } catch (err) {
    next(err)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndRemove(request.params.id)
    response.sendStatus(204).end()
  } catch (err) {
    next(err)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
