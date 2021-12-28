const express = require("express");
const cors = require('cors')
const morgan = require('morgan');

const Database = require("./helpers/db");
const db = new Database('./db/persons.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors()
);

app.use(
  express.json()
);

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan((tokens, req, res) => {
    buffer = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ];

    if (tokens.method(req, res) === 'POST') {
      buffer.push(
        tokens['body'](req, res)
      );
    }

    return buffer.join(' ');
  })
);

app.get('/info', async (request, response) => {
  const persons = await db.read();
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons', async (request, response) => {
  const persons = await db.read();

  response.json(persons);
});

app.get('/api/persons/:id', async (request, response) => {
  const persons = await db.read();
  
  const person = persons.find(p => p.id === Number(request.params.id));

  if (person) {
    response.json(person);
  } else {
    response
      .sendStatus(404)
      .end();
  }
});

app.post('/api/persons/', async (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing'
    });
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing'
    });
  }

  let persons = await db.read();

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique'
    });
  }

  const generateId = () => {
    return Math.floor(Math.random() * 10000);
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  response.json(person);
  await db.save(persons);
});

app.put('/api/persons/:id', async (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.sendStatus(400).json({
      error: 'name is missing'
    });
  }

  if (!body.number) {
    return response.sendStatus(400).json({
      error: 'number is missing'
    });
  }

  let persons = await db.read();
  let person = persons.find(p => p.id === Number(request.params.id));

  if (person) {
    person = { ...person, name: body.name, number: body.number }
    persons = persons.map(p => p.id === person.id ? person : p);
    response.json(person);
    await db.save(persons);
  } else {
    response
      .sendStatus(404)
      .end();
  }
});

app.delete('/api/persons/:id', async (request, response) => {
  const deletedId = Number(request.params.id);
  let persons = await db.read();

  const person = persons.find(p => p.id === deletedId);

  if (person) {
    persons = persons.filter(p => p.id !== deletedId);

    try {
      await db.save([...persons]);
    } catch (err) {
      response
        .sendStatus(500)
        .end();
    }

    response.sendStatus(204).end();
  } else {
    response
      .sendStatus(404)
      .end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
