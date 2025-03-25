import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPasswordScreen.css';

function ForgotPasswordScreen() {
    const [formData, setFormData] = useState({
        username: '',
        newPassword: '',
        confirmPassword: '',
        security_answer: ''
    });

    const [message, setMessage] = useState(null);
    const [securityQuestion, setSecurityQuestion] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const questions = [
            "Favorite book or movie?",
            "Name of birthplace?",
            "Mother's maiden name?"
        ];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setSecurityQuestion(randomQuestion);
    }, []);

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
            const response = await axios.post('https://plasma-torus-454810-h1.lm.r.appspot.com/forgot-password', {
                username: formData.username,
                new_password: formData.newPassword,
                confirm_password: formData.confirmPassword,
                security_answer: formData.security_answer,
                security_question: securityQuestion
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
                    <div className="question-wrapper">   
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
                            type="text"
                            name="security_answer"
                            className="input-field"
                            placeholder={securityQuestion}
                            value={formData.security_answer}
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
                    </div>
                    <div className="register-security-wrapper">
                        <div className="register-security-item">
                            {message && <p className='login-message'>{message}</p>}
                        </div>
                    </div>
                    <div className="password-button-wrapper">
                        <button type="button" className="back-button" onClick={handleBackClick}>Back</button>
                        <button type="submit" className="password-submit-button">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordScreen;