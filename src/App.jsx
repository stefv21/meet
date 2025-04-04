import React from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/eventlist';
import NumberOfEvents from './components/NumberOfEvents';

const App = () => {
  return (
    <div>
      <CitySearch />
      <EventList />
      <NumberOfEvents />
    </div>
  );
 }


export default App;