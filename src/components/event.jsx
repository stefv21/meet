import React, { useState } from 'react';

const LABELS = {
  HIDE_DETAILS: 'Hide Details',
  SHOW_DETAILS: 'Show Details',
  EVENT_DETAILS: 'Event Details'
};

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li className='event'>
      <h2>{event.summary}</h2>
      <p>{event.created}</p>
      <p>{event.location}</p>
      <button
        className="details-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? LABELS.HIDE_DETAILS : LABELS.SHOW_DETAILS}
      </button>
      {showDetails && (
        <div className='details'>
          <h4>{LABELS.EVENT_DETAILS}</h4>
          <p>{event.description}</p>
        </div>
      )}
    </li>
  );
};

export default Event;