import Countries from './Countries';
import Country from './Country';

const SearchResults = ({ results }) => {
  if (results.length > 10) {
    return <p>Too many matches, specify another filter</p>
  };

  if (results.length > 1 &&
    results.length < 10) {
    return <Countries countries={results} />
  }

  if (results.length === 1) {
    return <Country country={results[0]} />
  }

  return <p>Loading countries...</p>;
};

export default SearchResults;
