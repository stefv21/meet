import React, { useState } from 'react';



const NumberOfEvents = () => {
  // Set the default value to 32
  const [number, setNumber] = useState(32);

  const handleInputChanged = (event) => {
    // Update state with the new input value
    setNumber(event.target.value);
  };

  return (
    <div id="number-of-events">
      <input
        type="text"
        value={number}
        onChange={handleInputChanged}
        role="textbox"
      />
    </div>
  );
};

export default NumberOfEvents;
