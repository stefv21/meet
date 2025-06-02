import React from 'react';
import { useEffect, useState } from 'react';

import CitySearch from './components/CitySearch';
import EventList from './components/eventlist';         // adjust if your filename is EventList.jsx
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

import './App.css';

const App = () => {
  const [allLocations, setAllLocations]  = useState([]);
  const [currentNOE,   setCurrentNOE]    = useState(32);
  const [events,       setEvents]        = useState([]);
  const [currentCity,  setCurrentCity]   = useState("See all cities");
  const [infoAlert,    setInfoAlert]     = useState("");
  const [errorAlert,   setErrorAlert]    = useState("");
  const [warningAlert, setWarningAlert]  = useState("");

  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  const fetchData = async () => {
    try {
      // 1) If offline, load from cache and show WarningAlert
      if (!navigator.onLine) {
        const cachedEvents = localStorage.getItem("lastEvents");
        const offlineEvents = cachedEvents ? JSON.parse(cachedEvents) : [];
        setWarningAlert("You’re offline: showing cached events.");
        setEvents(offlineEvents);
        setAllLocations(extractLocations(offlineEvents));
        setInfoAlert("");
        setErrorAlert("");
        return;
      }

      // 2) Online path: clear any previous warning, then fetch live data
      setWarningAlert("");
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "See all cities"
        ? allEvents
        : allEvents.filter(event => event.location === currentCity);

      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
      setInfoAlert("");
      setErrorAlert("");
    } catch (error) {
      setErrorAlert("Something went wrong. Please try again later.");
      setInfoAlert("");
    }
  };

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert.length    ? <InfoAlert    text={infoAlert}    /> : null}
        {errorAlert.length   ? <ErrorAlert   text={errorAlert}   /> : null}
        {warningAlert.length ? <WarningAlert text={warningAlert} /> : null}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
      />

      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
      <CityEventsChart allLocations={allLocations} events={events} />
      <EventList events={events} />
    </div>
  );
};

export default App;
