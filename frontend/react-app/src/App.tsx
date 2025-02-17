import { useState, useEffect } from 'react';
import './components/Login/Login.css';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';
import ServerLess from './components/ServerLess/ServerLess';
import Loading from './components/Loading/Loading';

function App() {
  // Check if the user is logged in by looking at the cookie
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    document.cookie.includes('keepLoggedIn=true')
  );

  // State to track if the server is ready
  const [serverReady, setServerReady] = useState<boolean>(false);

  // New state to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkServerStatus = async (): Promise<void> => {

    try {
      const response = await fetch("http://127.0.0.1:5000/");

      if (!response.ok) {
        throw new Error("Server not ready");
      }

      console.log("Server is ready");
      setServerReady(true);

    } catch (error) {
      console.error("Error checking server status:", error);
      setServerReady(false);

    } finally {
      setIsLoading(false); // Loading is finished
    }
  };

  // Call it inside useEffect
  useEffect(() => {
    checkServerStatus();
  }, []);


  const handleLogout = () => {
    // Remove the login cookie and update state
    document.cookie =
      "keepLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    setIsLoggedIn(false);
  };

  // Render a loading screen while the server check is in progress
  if (isLoading) {
    return (
      <Loading title={true} />
    );
  }

  // If the server is not ready, render the ServerLess component
  if (!serverReady) {
    return <ServerLess />;
  }

  // Otherwise, conditionally render MainPage or Login based on the login status
  return (
    <>
      {isLoggedIn ? (
        <MainPage onLogout={handleLogout} checkServerStatus={checkServerStatus}/>
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;
