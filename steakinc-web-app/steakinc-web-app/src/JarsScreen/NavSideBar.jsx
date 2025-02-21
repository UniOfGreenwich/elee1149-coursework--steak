import React, { useState } from 'react';
import { FaHome, FaPiggyBank, FaChartPie, FaExchangeAlt, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './NavSideBar.css';

function NavSideBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
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
                    <button type='button' className='logout-button'>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default NavSideBar;