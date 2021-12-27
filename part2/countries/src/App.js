import { useState, useEffect } from "react";
import SearchForm from "./SearchForm";

import CountriesAPI from "./api/CountriesAPI";

import SearchResults from "./SearchResults";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSetTerm] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      const api = new CountriesAPI();
      const response = await api.getAll();

      setCountries(response.data);
    };

    fetchCountries();
  }, []);

  const handleSearchTermChange = (evt) => {
    setSetTerm(evt.target.value);
  };

  const countriesToRender = searchTerm !== ''
    ? countries.filter(country => {
      return country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    })
    : countries;

  return (
    <div className="App">
      <SearchForm searchTerm={searchTerm}
                  onChangeSearchTerm={handleSearchTermChange} />
      
      <SearchResults results={countriesToRender} />
    </div>
  );
}

export default App;
