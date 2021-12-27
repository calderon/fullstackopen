import React from 'react'

const Person = ({ person, onDeletePerson }) => (
  <li>
    {person.name} : {person.number}

    <button onClick={() => onDeletePerson(person)}>delete</button>
  </li>
);

export default Person;
