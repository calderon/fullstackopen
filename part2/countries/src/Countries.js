import { useState } from "react";
import Country from "./Country";

const Countries = ({ countries }) => {
  const [visibleCountries, setVisibleCountries] = useState([]);

  const handleShowCountry = (country) => {
    setVisibleCountries([...visibleCountries].concat(country.ccn3));
  };

  const countryIsVisible = (country) => visibleCountries.includes(country.ccn3);

  return (
    <ul>
      {countries.map(country => (
        <li key={country.ccn3}>
          {country.name.official}

          {countryIsVisible(country) &&
           <Country country={country} />}

          {!countryIsVisible(country) &&
           <button onClick={() => handleShowCountry(country)}>show</button>}
        </li>
      ))}
    </ul>
  )
};

export default Countries;
