import axios from 'axios';

class CountriesAPI {
  baseURL = 'https://restcountries.com/v3.1'

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL
    });
  }

  getAll() {
    return this.instance.get('/all');
  }
}

export default CountriesAPI;
