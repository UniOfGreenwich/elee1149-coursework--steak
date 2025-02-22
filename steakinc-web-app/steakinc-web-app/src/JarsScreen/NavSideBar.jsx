import React, { useState } from 'react';
import { FaHome, FaPiggyBank, FaChartPie, FaExchangeAlt, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavSideBar.css';

function NavSideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    
    const navigateToHome = () => {
        navigate('/dashboard', { state: { userId } });
    };

    const navigateToTransactions = () => {
        navigate('/transactions', { state: { userId } });
    };

    const navigateToJars = () => {
        navigate('/jars', { state: { userId } });
    };

    return (
        <div>
            <div className={`burger-menu ${isOpen ? 'hidden' : 'visible'}`} onClick={toggleSidebar}>
                <FaBars className='burger-icon' />
            </div>
            <div className={`nav-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="nav-header">
                    <img src="/src/assets/highsteaks.png" alt="Logo" className="logo-jars" />
                    <h1 className="nav-title">Steak</h1>
                    {isOpen && (
                        <div className="burger-menu inside" onClick={toggleSidebar}>
                            <FaBars className='burger-icon'/>
                        </div>
                    )}
                </div>
                <ul className="nav-list">
                    <li className="nav-item" onClick={navigateToHome}>
                        <FaHome className="nav-icon" />
                        <span>Home</span>
                    </li>
                    <li className="nav-item" onClick={navigateToJars}>
                        <FaPiggyBank className="nav-icon" />
                        <span>Money Jars</span>
                    </li>
                    <li className="nav-item">
                        <FaChartPie className="nav-icon" />
                        <span>Budgeting</span>
                    </li>
                    <li className="nav-item" onClick={navigateToTransactions}>
                        <FaExchangeAlt className="nav-icon" />
                        <span>Transactions</span>
                    </li>
                    <li className="nav-item">
                        <FaUser className="nav-icon" />
                        <span>Accounts</span>
                    </li>
                </ul>
                <div className="nav-footer">
                    <button type='button' className='logout-button'>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default NavSideBar;