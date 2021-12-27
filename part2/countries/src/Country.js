import { useState, useEffect } from "react";
import WeatherStackAPI from "./api/WeatherStackAPI";
import Weather from "./Weather";

const Country = ({ country }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    const fetchWeather = async () => {
      const api = new WeatherStackAPI();
      const response = await api.get({
        query: country.capital[0]
      });

      setWeather(response.data);

      return response;
    };

    fetchWeather();
  }, [country]);

  return (
    <article>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital[0]}</p>
      <p>population {country.population}</p>

      <figure>
        <img alt={`${country.name.official}'s flag`}
            src={country.flags.png} />
      </figure>

      <h2>languages</h2>
      <ul>
        {Object.keys(country.languages).map(language => (
          <li key={language}>
            {country.languages[language]}
          </li>
        )) }
      </ul>

      <Weather weather={weather} />
    </article>
  );
};

export default Country;
