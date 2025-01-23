import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPasswordScreen.css';

function ForgotPasswordScreen() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };


    return (
        <div className="container">
            <div className="password-container">
                <div className="password-title-wrapper">
                    <img src="/src/assets/highsteaks.png" alt="High Steaks Logo" className="logo-password" />
                    <h1 className="password-title-text">Steak</h1>
                </div>
                <form className="password-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Confirm Password"
                        className="input-field"
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
                                required
                                readOnly
                            />
                            <input
                                type="text"
                                name="security_1_answer"
                                className="input-field-security-answer"
                                placeholder='Answer'
                                required
                            />
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