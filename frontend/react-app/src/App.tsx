import { useState } from 'react';
import './components/Login/Login.css';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(document.cookie.includes('keepLoggedIn=true'));

  const handleLogout = () => {
    document.cookie = "keepLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? <MainPage onLogout={handleLogout} /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </>
  );
}

export default App;


