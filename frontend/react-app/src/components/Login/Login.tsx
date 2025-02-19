import React, { useState } from 'react';
import './Login.css';
import CookiesPopUp from './CookiesPopUp';

interface LoginProps {
    onLogin: () => void; // Function to update login state in App.tsx
    API_FLASK_SERVER_URL: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, API_FLASK_SERVER_URL }) => {
    const [password, setPassword] = useState<string>('');
    const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(JSON.parse(localStorage.getItem('keepLoggedIn_isChecked') || 'false'));
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);

    const COOKIE_NAME = 'keepLoggedIn';
    const COOKIE_PATH = 'path=/';

    const handleLogin = async () => {

        try {
            const response = await fetch(`${API_FLASK_SERVER_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });
    
            if (response.ok) {
                onLogin(); // Call function to update App.tsx state
    
                if (keepLoggedIn) {
                    const date = new Date();
                    date.setDate(date.getDate() + 1);
                    document.cookie = `${COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/; Secure; SameSite=Strict`;
                }
            } else {
                setWrongPassword(true);
            }
        } catch (error) {
            console.error("Login failed", error);
            setWrongPassword(true);
            window.location.reload();
        }

    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeepLoggedIn(e.target.checked);
        localStorage.setItem('keepLoggedIn_isChecked', JSON.stringify(e.target.checked));

        if (!e.target.checked) {
            // Delete the cookie
            document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${COOKIE_PATH}`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <h1>Oficina Oliveira</h1>
            <h2>Stock Management</h2>
            <div className="password-field">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    onKeyDown={handleKeyDown}
                />
                <p className={`wrong-password ${wrongPassword ? '' : 'hidden'}`}>Wrong Password</p>
            </div>
            <div className="keepLoggedInField">
                <input
                    type="checkbox"
                    id="keep-logged-in"
                    onChange={handleCheckboxChange}
                    checked={keepLoggedIn}
                />
                <label htmlFor="keep-logged-in">Keep me 24hr logged in</label>
            </div>
            <button className='login-btn' onClick={handleLogin}>Login</button>

            <CookiesPopUp />
        </div>
    );
};

export default Login;
