import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import HomeScreen from './HomeScreen/HomeScreen.jsx';
import LoginScreen from './LoginScreen/LoginScreen.jsx';
import RegisterScreen from './RegisterScreen/RegisterScreen.jsx';
import ForgotPasswordScreen from './ForgotPasswordScreen/ForgotPasswordScreen.jsx';
import AcountInfoScreen from './AccountInfoScreen/AccountInfoScreen.jsx'
import DashboardScreen from './DashboardScreen/DashboardScreen.jsx';
import JarsScreen from './JarsScreen/JarsScreen.jsx';
import TransactionsScreen from './TransactionScreen/TransactionScreen.jsx';
import AccountsScreen from './AccountScreen/AccountScreen.jsx';
import BudgetScreen from './BudgetScreen/BudgetScreen.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/account-setup" element={<AcountInfoScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/jars" element={<JarsScreen />} />
        <Route path="/transactions" element={<TransactionsScreen />} />
        <Route path="/accounts" element={<AccountsScreen />} />
        <Route path="/budget" element={<BudgetScreen />} />
      </Routes>
    </Router>
  </StrictMode>
);