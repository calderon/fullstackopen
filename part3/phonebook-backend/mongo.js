const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://admin:${password}@cluster0.sxgfa.mongodb.net/persons-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log(`phonebook:`);

      if (persons.length) {
        for (let person of persons) {
          console.log(`${person.name} ${person.number}`);
        }
      } else {
        console.log(`Sorry, but there is no people`)
      }

      mongoose.connection.close();
    });
}

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  
  person.save().then(person => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    
    mongoose.connection.close();
  });  
}
