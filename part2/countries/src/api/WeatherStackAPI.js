import axios from "axios";

class WeatherStackAPI {
  baseURL = 'http://api.weatherstack.com/current';

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL,
      params: {
        access_key: process.env.REACT_APP_WEATHERSTACK_API
      }
    });
  }

  get(params) {
    return this.instance.get('', { params });
  }
}

export default WeatherStackAPI;
