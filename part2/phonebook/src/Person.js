import React from 'react'

const Person = ({ person }) => (
  <li>
    {person.name} : {person.number}
  </li>
);

export default Person;
