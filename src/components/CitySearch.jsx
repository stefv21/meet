import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query,           setQuery]           = useState("");
  const [suggestions,     setSuggestions]     = useState([]);

  useEffect(() => {
    setSuggestions(Array.isArray(allLocations) ? allLocations : []);
  }, [allLocations]);

  const handleInputChanged = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = Array.isArray(allLocations)
      ? allLocations.filter(loc =>
          loc.toUpperCase().includes(value.toUpperCase())
        )
      : [];

    setSuggestions(filtered);

    
  };

  return (
    <div id="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />

      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map(loc => (
            <li key={loc} onClick={handleItemClicked}>
              {loc}
            </li>
          ))}
          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
