import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginScreen.css';

function LoginScreen() {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleChange = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', loginData);
            setMessage(response.data.message);
            // Handle success, e.g., save user ID, redirect, etc.
            console.log('User ID:', response.data.user_id);
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <div className="login-title-wrapper">
                    <img src="/src/assets/highsteaks.png" alt="High Steaks Logo" className="logo-login" />
                    <h1 className="login-title-text">Steak</h1>
                </div>
                {/* Template Message for login */}
                {message && <p>{message}</p>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="input-field"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input-field"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="login-button-wrapper">
                        <button className="back-button" onClick={handleBackClick}>Back</button>
                        <button type="submit" className="login-submit-button">Login</button>
                    </div>
                </form>
                <div className="login-link-wrapper">
                    <button className="forgot-password-button" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                    <button className="join-us-button" onClick={() => navigate('/register')}>Haven't Joined Us Yet?</button>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;