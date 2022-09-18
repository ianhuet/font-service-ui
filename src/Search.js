import { debounce } from "debounce";
import { useEffect } from "preact/hooks";

export const Search = (props) => {
  const { setSearchResultSet, source } = props;

  const filterBySearch = (event) => {
    const query = event.target.value;
    const searchList = [...source].filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );

    setSearchResultSet(searchList);
  };

  const debounceFilter = debounce(filterBySearch, 500);

  useEffect(() => {
    return () => debounceFilter.clear();
  });

  return (
    <div className="search">
      <div className="searchBox">
        <label>Search</label>
        <input id="searchBox" onChange={debounceFilter} />
      </div>
    </div>
  );
};
