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
  const [accountSetupData, setAccountSetupData] = useState({
    accountName: '',
    accountType: '',
    balance: '',
    monthlyIncome: ''
  });
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleRegistrationChange = (event) => {
    setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
  };

  const handleLoginChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const handleAccountSetupChange = (event) => {
    setAccountSetupData({ ...accountSetupData, [event.target.name]: event.target.value });
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
      setUserId(response.data.user_id);
      setIsNewUser(response.data.is_new);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleAccountSetupSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/setup', { ...accountSetupData, userId });
      await axios.post(`http://localhost:5000/update_new_status/${userId}`, { new: false });
      setMessage('Account and Income details saved successfully.');
      setIsNewUser(false);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
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

      {isNewUser && (
        <form onSubmit={handleAccountSetupSubmit}>
          <h3>Account and Income Setup</h3>
          <div>
            <label>Account Name:</label>
            <input
              type="text"
              name="accountName"
              value={accountSetupData.accountName}
              onChange={handleAccountSetupChange}
              required
            />
          </div>
          <div>
            <label>Account Type:</label>
            <input
              type="text"
              name="accountType"
              value={accountSetupData.accountType}
              onChange={handleAccountSetupChange}
              required
            />
          </div>
          <div>
            <label>Balance:</label>
            <input
              type="number"
              name="balance"
              value={accountSetupData.balance}
              onChange={handleAccountSetupChange}
              required
            />
          </div>
          <div>
            <label>Monthly Income:</label>
            <input
              type="number"
              name="monthlyIncome"
              value={accountSetupData.monthlyIncome}
              onChange={handleAccountSetupChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default UserForm;
