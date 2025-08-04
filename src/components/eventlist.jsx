import React from 'react';
import Event from "./event";


const EventList = ({ events }) => {
    return (
      <ul id="event-list">
        {Array.isArray(events) ?
          events.map(event => <Event key={event?.id || Math.random()} event={event} />) :
          null}
      </ul>
    );
   }


export default EventList;