import React, { useEffect, useState } from 'react';
import './ServerLess.css';

const ServerLess: React.FC = () => {
  const waitTime = 15; // Seconds

  const [countdown, setCountdown] = useState(waitTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          window.location.reload();
          return waitTime; // Reset countdown after reload
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="serverless-container">
      <h1>Server Unavailable</h1>
      <p>The server is currently offline. Retrying in {countdown} seconds...</p>
      <button onClick={() => window.location.reload()}>
        Retry Now
      </button>
    </div>
  );
};

export default ServerLess;