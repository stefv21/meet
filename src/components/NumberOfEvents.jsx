import React, { useState } from 'react';

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert }) => {
  const [number, setNumber] = useState(32);

  const handleInputChanged = (event) => {
    const value = event.target.value.trim();
    setNumber(value);

    // 1. Reject anything non‐numeric:
    if (!/^\d+$/.test(value)) {
      setErrorAlert("Please enter a valid number (only digits).");
      return;
    }

    const intValue = Number(value);

    // 2. Must be greater than zero:
    if (intValue <= 0) {
      setErrorAlert("Number of events must be greater than zero.");
      return;
    }

    // 3. Reject values above 100 (adjust as you see fit):
    if (intValue > 100) {
      setErrorAlert("Please enter 100 or fewer events.");
      return;
    }

    // If we reach here, the input is valid:
    setErrorAlert("");
    setCurrentNOE(intValue);
  };

  return (
    <div id="number-of-events">
      <input
        type="number"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
};

export default NumberOfEvents;

