import React from 'react';
import { FaHome, FaPiggyBank, FaChartPie, FaExchangeAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './NavSideBar.css'; // Assuming you have some CSS for styling

const NavSideBar = () => {
    return (
        <div className="nav-sidebar">
            <div className="nav-header">
                <img src="/path/to/logo.png" alt="Logo" className="nav-logo" />
                <h1 className="nav-title">Steak Inc.</h1>
            </div>
            <ul className="nav-list">
                <li className="nav-item">
                    <FaHome className="nav-icon" />
                    <span>Home</span>
                </li>
                <li className="nav-item">
                    <FaPiggyBank className="nav-icon" />
                    <span>Money Jars</span>
                </li>
                <li className="nav-item">
                    <FaChartPie className="nav-icon" />
                    <span>Budgeting</span>
                </li>
                <li className="nav-item">
                    <FaExchangeAlt className="nav-icon" />
                    <span>Transactions</span>
                </li>
                <li className="nav-item">
                    <FaUser className="nav-icon" />
                    <span>Accounts</span>
                </li>
            </ul>
            <div className="nav-footer">
                <button className="logout-button">
                    <FaSignOutAlt className="nav-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default NavSideBar;