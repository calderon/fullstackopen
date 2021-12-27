const Weather = ({ weather }) => {
  console.log(weather);

  if (!Object.keys(weather).length) {
    return <p>Loading weather in the capital...</p>;
  }

  return (
    <>
      <h2>Weather in {weather.location.name}</h2>
      <strong>temperature</strong>: {weather.current.temperature} Celcius
      <figure>
        <img alt={weather.current.weather_description}
             src={weather.current.weather_icons} />
      </figure>
      <strong>wind</strong>: {weather.current.wind_speed} SSW
    </>
  );
};

export default Weather;
