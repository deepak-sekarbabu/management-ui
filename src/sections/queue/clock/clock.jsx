import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p style={{ fontWeight: 'bold', color: 'red' }}>{time.toLocaleTimeString()}</p>
    </div>
  );
}

export default Clock;
