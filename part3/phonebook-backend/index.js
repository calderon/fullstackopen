const express = require("express");

const Database = require("./helpers/db");
const db = new Database('./db/persons.json');

const app = express();
const PORT = 3001;

app.use(
  express.json()
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
      .status(404)
      .send(404)
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

    response.send(204).end();
  } else {
    response
      .sendStatus(404)
      .end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
