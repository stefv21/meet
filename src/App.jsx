import React, { useEffect, useState } from 'react';

import CitySearch from './components/CitySearch';
import EventList from './components/eventlist'; // Adjust if filename is different
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  const fetchData = async () => {
    try {
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

      setWarningAlert("");
      const allEvents = await getEvents();
      const filteredEvents =
        currentCity === "See all cities"
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
        {infoAlert && <InfoAlert text={infoAlert} />}
        {errorAlert && <ErrorAlert text={errorAlert} />}
        {warningAlert && <WarningAlert text={warningAlert} />}
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

      {/* ── Chart Grid Display ── */}
      <div className="charts-container">
        <CityEventsChart allLocations={allLocations} events={events} />
        <EventGenresChart events={events} />
      </div>

      <EventList events={events} />
    </div>
  );
};

export default App;
