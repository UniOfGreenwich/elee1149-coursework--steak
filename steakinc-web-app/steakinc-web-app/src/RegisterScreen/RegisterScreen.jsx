import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterScreen.css';

function registerScreen() {
    const [registrationData, setRegistrationData] = useState({
        username: '',
        password: '',
        email: '',
        security_1: '',
        security_2: '',
        security_3: ''
      });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleRegistrationChange = (event) => {
        setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', registerData);
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
            <div className="register-container">
                <div className="register-title-wrapper">
                    <img src="/src/assets/highsteaks.png" alt="High Steaks Logo" className="logo-register" />
                    <h1 className="register-title-text">Steak</h1>
                </div>
                {/* Template Message for register */}
                {message && <p>{message}</p>}
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-details-wrapper">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="input-field"
                            value={registrationData.username}
                            onChange={handleRegistrationChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input-field-password"
                            value={registrationData.password}
                            onChange={handleRegistrationChange}
                            required
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="input-field"
                            value={registrationData.email}
                            onChange={handleRegistrationChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Confirm Password"
                            className="input-field-password"
                            value={registrationData.Password}
                            onChange={handleRegistrationChange}
                            required
                        />
                    </div>
                    <div className="register-security-wrapper">
                        <div className="register-security-item">
                            <input
                                type="text"
                                name="security_1"
                                className="input-field-security"
                                placeholder='Favorite book or movie?'
                                onChange={handleRegistrationChange}
                                required
                                readOnly
                            />
                            <input
                                type="text"
                                name="security_1_answer"
                                className="input-field-security-answer"
                                placeholder='Answer'
                                onChange={handleRegistrationChange}
                                required
                            />
                        </div>
                        <div className="register-security-item">
                            <input
                                type="text"
                                name="security_2"
                                className="input-field-security"
                                placeholder='Name of birthplace?'
                                onChange={handleRegistrationChange}
                                required
                                readOnly
                            />
                            <input
                                type="text"
                                name="security_2_answer"
                                className="input-field-security-answer"
                                placeholder='Answer'
                                onChange={handleRegistrationChange}
                                required
                            />
                        </div>
                        <div className="register-security-item">
                            <input
                                type="text"
                                name="security_3"
                                className="input-field-security"
                                placeholder="Mother's maiden name?"
                                onChange={handleRegistrationChange}
                                required
                                readOnly
                            />
                            <input
                                type="text"
                                name="security_3"
                                className="input-field-security-answer"
                                placeholder="Answer"
                                onChange={handleRegistrationChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="register-button-wrapper">
                        <button className="back-button" onClick={handleBackClick}>Back</button>
                        <button type="submit" className="register-button">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default registerScreen;