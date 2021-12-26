import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PersonAPI from './api/persons';
import Filter from './Filter';
import PersonForm from './PersonForm';

import Persons from './Persons';

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');

  useEffect(() => {
    const fetchPersons = async () => {
      const api = new PersonAPI();
      const response = await api.fetch();
      setPersons(response.data);

      return response.data;
    }

    fetchPersons();
  }, []);

  const handleNameChange = (evt) => {
    setNewName(evt.target.value);
  };

  const handleNewNumberChange = (evt) => {
    setNewNumber(evt.target.value);
  };

  const handleNewSearchTermChange = (evt) => {
    setSearchTerm(evt.target.value);
  };

  const handlePersonFormSubmit = (evt) => {
    evt.preventDefault();
    
    setPersons(persons.concat({
      name: newName,
      number: newNumber
    }));
  };

  const personsToRender = searchTerm !== ''
    ? persons.filter(person => {
      return person.name.toLocaleLowerCase().includes(
        searchTerm.toLocaleLowerCase()
      );
    })
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchTerm}
              onChange={handleNewSearchTermChange} />

      <h3>Add a new</h3>
      <PersonForm name={newName}
                  number={newNumber}
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNewNumberChange}
                  handleSubmit={handlePersonFormSubmit}/>

      <h3>Numbers</h3>
      <Persons persons={personsToRender} />
    </div>
  )
}

export default App
