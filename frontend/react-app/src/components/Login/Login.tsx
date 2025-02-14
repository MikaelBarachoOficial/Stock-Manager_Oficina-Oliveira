import React, { useState } from 'react';
import './Login.css';
import CookiesPopUp from './CookiesPopUp';

const Login: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(document.cookie.includes('keepLoggedIn=true') || false);
    const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(JSON.parse(localStorage.getItem('keepLoggedIn isChecked') || 'false'));
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);

    const COOKIE_NAME = 'keepLoggedIn';
    const COOKIE_PATH = 'path=/';

    const handleLogin = () => {
        if (password === 'i') {
            setIsLoggedIn(true);
            if (keepLoggedIn) {
                // Calculate the expiration date (1 day from now)
                const date = new Date();
                date.setDate(date.getDate() + 1);
                const expires = date.toUTCString();
                // Set the cookie with the expiration date
                document.cookie = `${COOKIE_NAME}=true; expires=${expires}; ${COOKIE_PATH}`;
            }
        } else {
            setWrongPassword(true);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeepLoggedIn(e.target.checked);
        if (!e.target.checked) {
            // Delete the cookie by setting its expiration date to a past date
            document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${COOKIE_PATH}`;
        }
        localStorage.setItem(`${COOKIE_NAME} isChecked`, JSON.stringify(e.target.checked));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <h1>Oficina Oliveira</h1>
                <h2>Stock Management</h2>
                <div className='password-field'>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        onKeyDown={handleKeyDown}
                    />
                    <p className={`wrong-password ${wrongPassword ? 'visible' : 'hidden'}`}>Wrong Password</p>
                </div>
                <div>
                    <div className="keepLoggedInField">
                        <input
                            type="checkbox"
                            id="keep-logged-in"
                            onChange={handleCheckboxChange}
                            checked={keepLoggedIn}
                        />
                        <label htmlFor="keep-logged-in">Keep me 24hr logged in</label>
                    </div>
                </div>
                <button onClick={handleLogin}>Login</button>
                
                <CookiesPopUp />
            </div>
        );
    }

    return null;
};

export default Login;