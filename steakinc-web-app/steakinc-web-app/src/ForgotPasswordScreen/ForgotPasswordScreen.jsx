import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPasswordScreen.css';

function ForgotPasswordScreen() {
    const [formData, setFormData] = useState({
        username: '',
        newPassword: '',
        confirmPassword: '',
        security_1_answer: ''
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/forgot-password', {
                username: formData.username,
                new_password: formData.newPassword,
                confirm_password: formData.confirmPassword,
                security_1_answer: formData.security_1_answer
            });
            setMessage(response.data.message);
            
            // Navigate to login page after a short delay if successful
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
            <div className="password-container">
                <div className="password-title-wrapper">
                    <img src="/src/assets/highsteaks.png" alt="High Steaks Logo" className="logo-password" />
                    <h1 className="password-title-text">Steak</h1>
                </div>
                <form className="password-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="input-field"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        className="input-field"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="input-field"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <div className="security-title-wrapper">
                        <h2 className='security-title-text'>Security Question</h2>
                    </div>
                    <div className="register-security-wrapper">
                        <div className="register-security-item">
                            <input
                                type="text"
                                name="security_1"
                                className="input-field-security"
                                placeholder='Favorite book or movie?'
                                readOnly
                            />
                            <input
                                type="text"
                                name="security_1_answer"
                                className="input-field-security-answer"
                                placeholder='Answer'
                                value={formData.security_1_answer}
                                onChange={handleChange}
                                required
                            />
                            {message && <p className='login-message'>{message}</p>}
                        </div>
                    </div>
                    <div className="password-button-wrapper">
                        <button className="back-button" onClick={handleBackClick}>Back</button>
                        <button type="submit" className="password-submit-button">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordScreen;
