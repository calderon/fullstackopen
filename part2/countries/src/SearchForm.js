const SearchForm = ({ searchTerm, onChangeSearchTerm }) => (
  <>
    find countries <input onChange={onChangeSearchTerm}
                          value={searchTerm} />
  </>
);

export default SearchForm;
