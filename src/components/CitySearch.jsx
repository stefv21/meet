import React, { useState, useEffect } from 'react';

const LABELS = {
  SEE_ALL_CITIES: 'See all cities'
};

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query,           setQuery]           = useState("");
  const [suggestions,     setSuggestions]     = useState([]);

  useEffect(() => {
    setSuggestions(Array.isArray(allLocations) ? allLocations : []);
  }, [allLocations]);

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value);
    setInfoAlert("")
  };

  const handleInputChanged = (event) => {
    const value = event.target.value;
    const filteredLocations = allLocations ? allLocations.filter((location) => {
      return location && typeof location === 'string' && location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    }) : [];
 
 
    setQuery(value);
    setSuggestions(filteredLocations);
 
 
    let infoText;
    if (filteredLocations.length === 0) {
      infoText = "We can not find the city you are looking for. Please try another city"
    } else {
      infoText = ""
    }
    setInfoAlert(infoText);
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
        {suggestions.map((loc) => (
          <li
            key={loc}
            onClick={() => {
              setCurrentCity(loc);
              setQuery(loc);
              setShowSuggestions(false);
            }}
          >
            {loc}
          </li>
        ))}
        <li
        key={LABELS.SEE_ALL_CITIES}
        onClick={() => {
          setCurrentCity(LABELS.SEE_ALL_CITIES);
          setShowSuggestions(true);
        }}
        >
        <b>{LABELS.SEE_ALL_CITIES}</b>
        </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
