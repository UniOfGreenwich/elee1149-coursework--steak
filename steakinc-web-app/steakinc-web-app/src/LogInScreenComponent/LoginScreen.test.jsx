import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [activeForm, setActiveForm] = useState('register');
  const [registrationData, setRegistrationData] = useState({
    username: '',
    password: '',
    email: '',
    security_1: '',
    security_2: '',
    security_3: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState(null);

  const handleRegistrationChange = (event) => {
    setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
  };

  const handleLoginChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', registrationData);
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>User Authentication</h2>
      {message && <p>{message}</p>}
      <div>
        <button onClick={() => setActiveForm('register')}>Register</button>
        <button onClick={() => setActiveForm('login')}>Login</button>
      </div>

      {activeForm === 'register' && (
        <form onSubmit={handleRegistrationSubmit}>
          <h3>Register</h3>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={registrationData.username}
              onChange={handleRegistrationChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={registrationData.password}
              onChange={handleRegistrationChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={registrationData.email}
              onChange={handleRegistrationChange}
              required
            />
          </div>
          <div>
            <label>Security Question 1:</label>
            <input
              type="text"
              name="security_1"
              value={registrationData.security_1}
              onChange={handleRegistrationChange}
            />
          </div>
          <div>
            <label>Security Question 2:</label>
            <input
              type="text"
              name="security_2"
              value={registrationData.security_2}
              onChange={handleRegistrationChange}
            />
          </div>
          <div>
            <label>Security Question 3:</label>
            <input
              type="text"
              name="security_3"
              value={registrationData.security_3}
              onChange={handleRegistrationChange}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      )}

      {activeForm === 'login' && (
        <form onSubmit={handleLoginSubmit}>
          <h3>Login</h3>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default UserForm;
