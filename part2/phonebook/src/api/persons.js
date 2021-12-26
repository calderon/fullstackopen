import axios from 'axios';

class PersonAPI {
  baseURL = 'http://localhost:3001/persons';

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL
    });
  }

  fetch() {
    return this.instance.get();
  }
}

export default PersonAPI;
