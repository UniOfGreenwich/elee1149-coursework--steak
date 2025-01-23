import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import HomeScreen from './HomeScreen/HomeScreen.jsx';
import LoginScreen from './LoginScreen/LoginScreen.jsx';
import RegisterScreen from './RegisterScreen/RegisterScreen.jsx';
import ForgotPasswordScreen from './ForgotPasswordScreen/ForgotPasswordScreen.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      </Routes>
    </Router>
  </StrictMode>
);