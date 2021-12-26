import React from "react";

const PersonForm = ({
  name,
  handleNameChange,
  number,
  handleNumberChange,
  handleSubmit
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <div>name: <input onChange={handleNameChange}
                        value={name} /></div>
      <div>number: <input onChange={handleNumberChange}
                          value={number} /></div>
      <div><button type="submit">add</button></div>
    </div>
  </form>
);

export default PersonForm;
