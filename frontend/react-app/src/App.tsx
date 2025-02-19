import { useState, useEffect, useCallback } from 'react';
import './components/Login/Login.css';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';
import ServerLess from './components/ServerLess/ServerLess';
import Loading from './components/Loading/Loading';

function App() {
  const [serverReady, setServerReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if the user is logged in by looking at the cookie
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    document.cookie.includes('keepLoggedIn=true')
  );

  const localStorageKey = 'apiFlaskServerUrl';

  // Initialize API_FLASK_SERVER_URL from localStorage if available, or use default value
  const [API_FLASK_SERVER_URL, setAPI_FLASK_SERVER_URL] = useState<string>(() => {
    const storedUrl = localStorage.getItem(localStorageKey);
    return storedUrl ? storedUrl : 'http://192.168.1.3:81';
  });

  // Update localStorage whenever API_FLASK_SERVER_URL changes
  useEffect(() => {
    console.log('API_FLASK_SERVER_URL has changed to:', API_FLASK_SERVER_URL);
    localStorage.setItem(localStorageKey, API_FLASK_SERVER_URL);
  }, [API_FLASK_SERVER_URL]);


   // Memoize checkServerStatus so that it only changes when API_FLASK_SERVER_URL changes
   const checkServerStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_FLASK_SERVER_URL}/`);
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
  }, [API_FLASK_SERVER_URL]);

  // Call checkServerStatus whenever its dependencies change
  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);


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
    return <ServerLess setAPI_FLASK_SERVER_URL={setAPI_FLASK_SERVER_URL} />;
  }

  // Otherwise, conditionally render MainPage or Login based on the login status
  return (
    <>
      {isLoggedIn ? (
        <MainPage onLogout={handleLogout} checkServerStatus={checkServerStatus} API_FLASK_SERVER_URL={API_FLASK_SERVER_URL} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} API_FLASK_SERVER_URL={API_FLASK_SERVER_URL} />
      )}
    </>
  );
}

export default App;
