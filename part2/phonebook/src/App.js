import React, { useState, useEffect } from 'react';

import PersonService from './services/persons';

import Notification from './Notification';
import Filter from './Filter';
import PersonForm from './PersonForm';

import Persons from './Persons';

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ notification, setNotification ] = useState({})

  useEffect(() => {
    const fetchPersons = async () => {
      const data = await PersonService.get();
      setPersons(data);

      return data;
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

    const addPerson = async () => {
      try {
        const person = {
          name: newName,
          number: newNumber
        };

        const returnedPerson = await PersonService.post(person);

        setPersons(persons.concat(returnedPerson));
        setNotification({
          type: 'alert',
          message: `Added ${person.name}`
        });
      } catch (err) {
        setNotification({
          type: 'error',
          message: err.response.data.error
        });
      }

      setTimeout(() => {
        setNotification()
      }, 5000);
    }

    const updatePerson = async (person) => {
      try {
        person = {
          ...person,
          name: newName,
          number: newNumber
        };

        const updatedPerson = await PersonService.put(person.id, person);

        setPersons(persons.map(p => p.id === person.id ? updatedPerson : p));
        setNotification({
          type: 'alert',
          message: `Updated ${person.name}`
        });
      } catch (err) {
        setNotification({
          type: 'error',
          message: err.response.data.error
        });
      }
    }

    const person = persons.find(p => p.name === newName);

    if (person) {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson(person);
      }
    } else {
      addPerson();
    }
  };

  const handleDeletePerson = (person) => {
    const deletePerson = async () => {
      try {
        await PersonService.remove(person.id);

        setNotification({
          type: 'alert',
          message: `${person.name} has been removed from server`
        });
      } catch (error) {
        setNotification({
          type: 'error',
          message: `Information of ${person.name} has already been removed from server`
        });
      }

      setTimeout(() => {
        setNotification()
      }, 5000);

      setPersons(persons.filter(p => p.id !== person.id));
    }

    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson();
    }
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
      <Notification notification={notification} />
      <Filter value={searchTerm}
              onChange={handleNewSearchTermChange} />

      <h3>Add a new</h3>
      <PersonForm name={newName}
                  number={newNumber}
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNewNumberChange}
                  handleSubmit={handlePersonFormSubmit}/>

      <h3>Numbers</h3>
      <Persons persons={personsToRender}
               onDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App;
