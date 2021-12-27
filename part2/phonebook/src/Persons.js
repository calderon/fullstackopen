import Person from "./Person";

const Persons = ({ persons, onDeletePerson }) => (
  <>
    {persons.map(person => (
      <Person key={person.id}
              person={person}
              onDeletePerson={onDeletePerson} />
    ))}
  </>
)

export default Persons;
