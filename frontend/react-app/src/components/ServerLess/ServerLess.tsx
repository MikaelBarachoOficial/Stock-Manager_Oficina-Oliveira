import React, { useEffect, useState } from 'react';
import './ServerLess.css';

interface ServerLessProps {
  setAPI_FLASK_SERVER_URL: (url: string) => void;
}

const ServerLess: React.FC<ServerLessProps> = ({ setAPI_FLASK_SERVER_URL }) => {
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

  // Function to change the API address
  const changeIpAddress = (newAddress: string): void => {
    setAPI_FLASK_SERVER_URL(`http://${newAddress}:81`);
  };

  // SERVER INSTALLER MUST BE IN PUBLIC FOLDER

  return (
    <div className="serverless-container">
      <h1>Server Unavailable</h1>
      <p>The server is currently offline. Retrying in {countdown} seconds...</p>
      <button onClick={() => window.location.reload()}>
        Retry Now
      </button>
      <button
        onClick={() => {
          const newAddress = prompt('Insira o novo IP Address:');
          if (newAddress) {
            changeIpAddress(newAddress);
          }
        }}
      >
        Change API Address
      </button>
      <a href="/OficinaOliveira_Installer.exe" download>
        Download Server
      </a>
    </div>
  );
};

export default ServerLess;