import React, { useState } from 'react';
import { useNavigate,  useLocation } from 'react-router-dom';
import axios from 'axios';
import './LoginScreen.css';

function LoginScreen() {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Get the location object

    const handleBackClick = () => {
        navigate('/');
    };

    const handleChange = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://plasma-torus-454810-h1.lm.r.appspot.com/login', loginData);
            setMessage(response.data.message);

            const userId = response.data.user_id;
            const isNew = response.data.is_new;

            if (isNew) {
                // Redirect to account setup, passing the user ID
                navigate('/account-setup', { state: { userId } });
            } else {
                // Redirect to the dashboard or appropriate page
                navigate('/dashboard', { state: { userId } });
            }
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
                    <img src="/elee1149-coursework--steak/assets/highsteaks.png" alt="High Steaks Logo" className="logo-login" />
                    <h1 className="login-title-text">Steak</h1>
                </div>
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
                    {message && <p className='login-message'>{message}</p>}
                    <div className="login-button-wrapper">
                        <button type="button" className="back-button" onClick={handleBackClick}>Back</button>
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
