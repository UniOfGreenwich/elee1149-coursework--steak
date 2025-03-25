import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterScreen.css';

function RegisterScreen() {
    const [registrationData, setRegistrationData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
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

        // Check if passwords match
        if (registrationData.password !== registrationData.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        // Check if password meets the specifications
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
        if (!passwordRegex.test(registrationData.password)) {
            setMessage('Password must be at least 8 characters long, contain at least one number, one uppercase letter, and one special character.');
            return;
        }

        // Prepare the data to send to the backend.
        const dataToSend = {
            username: registrationData.username,
            password: registrationData.password,
            email: registrationData.email,
            security_1: registrationData.security_1,
            security_2: registrationData.security_2,
            security_3: registrationData.security_3
        };

        try {
            const response = await axios.post('https://plasma-torus-454810-h1.lm.r.appspot.com/register', dataToSend);
            setMessage(response.data.message);
            console.log('User ID:', response.data.user_id);

            // Navigate to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2000 milliseconds = 2 seconds
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
                            tabIndex={1}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input-field-password"
                            value={registrationData.password}
                            onChange={handleRegistrationChange}
                            required
                            tabIndex={3}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input-field"
                            value={registrationData.email}
                            onChange={handleRegistrationChange}
                            required
                            tabIndex={2}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="input-field-password"
                            value={registrationData.confirmPassword}
                            onChange={handleRegistrationChange}
                            required
                            tabIndex={4}
                        />
                    </div>
                    <div className="security-title-wrapper">
                        <h2 className='security-title-text'>Security Questions</h2>
                    </div>
                    <div className="register-security-wrapper">
                        <div className="register-security-item">
                            <input
                                    type="text"
                                    name="security_1"
                                    className="input-field-security"
                                    placeholder='Favorite book or movie?'
                                    required
                                    readOnly
                                    tabIndex={-1}
                            />
                            <input
                                type="text"
                                name="security_1"
                                className="input-field-security-answer"
                                placeholder='Answer'
                                value={registrationData.security_1}
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
                                required
                                readOnly
                                tabIndex={-1}
                            />
                            <input
                                type="text"
                                name="security_2"
                                className="input-field-security-answer"
                                placeholder='Answer'
                                value={registrationData.security_2}
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
                                required
                                readOnly
                                tabIndex={-1}
                            />
                            <input
                                type="text"
                                name="security_3"
                                className="input-field-security-answer"
                                placeholder="Answer"
                                value={registrationData.security_3}
                                onChange={handleRegistrationChange}
                                required
                            />
                            {message && <p className="login-message">{message}</p>}
                        </div>
                    </div>
                    <div className="register-button-wrapper">
                        <button type="button" className="back-button" onClick={handleBackClick}>Back</button>
                        <button type="submit" className="register-button">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterScreen;