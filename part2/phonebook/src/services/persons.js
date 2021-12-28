import axios from 'axios';

const baseURL = '/api/persons';

const get = async () => {
  const request = await axios.get(baseURL);

  return request.data;
};

const post = async (person) => {
  const request = await axios.post(baseURL, person);

  return request.data;
};

const put = async (id, person) => {
  const request = await axios.put(`${baseURL}/${id}`, person);

  return request.data;
};

const remove = async (id) => {
  const request = await axios.delete(`${baseURL}/${id}`);

  return request.data;
}

const PersonService = { get, post, put, remove };

export default PersonService;
