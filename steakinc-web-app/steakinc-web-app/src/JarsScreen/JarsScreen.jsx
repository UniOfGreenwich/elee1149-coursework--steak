import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavSideBar from './NavSideBar';
import './JarsScreen.css'; 
import Lid from './Lid';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { CustomNextArrow, CustomPrevArrow } from './CustomArrows';
import VerticalCarousel from './VerticalCarousel';
import TransactionForm from '../components/TransactionForm'; // Import the TransactionForm

function JarScreen() {
    const [jarName, setJarName] = useState('');
    const [allocatedAmount, setAllocatedAmount] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [jars, setJars] = useState([]);
    const [availableTotal, setAvailableTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedJar, setSelectedJar] = useState(null); // State for selected jar
    const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
    const [showTransactionModal, setShowTransactionModal] = useState(false); // State for transaction modal
    const [transactions, setTransactions] = useState([]); // State for transactions related to the selected jar
    const location = useLocation();
    const userId = location.state?.userId;
    const [isAccountInfoVisible, setIsAccountInfoVisible] = useState(false);

    const toggleAccountInfo = () => {
        setIsAccountInfoVisible(!isAccountInfoVisible);
    };

    const horizontalSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false
    };

    useEffect(() => {
        const fetchAccountsAndJars = async () => {
            if (userId) {
                try {
                    const accountResponse = await axios.get(`http://localhost:5000/total_balance/${userId}`);
                    const jarResponse = await axios.get(`http://localhost:5000/user_jars/${userId}`);
                    
                    if (accountResponse.data.accounts) {
                        setAccounts(accountResponse.data.accounts);
                        setAvailableTotal(accountResponse.data.available_total);
                        console.log("Accounts fetched:", accountResponse.data.accounts); // Debugging log
                    } else {
                        console.error("Accounts not found in response");
                    }

                    if (jarResponse.data.jars) {
                        setJars(jarResponse.data.jars);
                        console.log("Jars fetched:", jarResponse.data.jars); // Debugging log
                        if (jarResponse.data.jars.length > 0) {
                            setSelectedJar(jarResponse.data.jars[0]); // Default to first jar
                        }
                    } else {
                        console.error("Jars not found in response");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            } else {
                console.error("User ID is not defined");
            }
        };

        fetchAccountsAndJars();
    }, [userId]);

    useEffect(() => {
        if (selectedJar) {
            fetchJarTransactions(selectedJar.jar_id);
        }
    }, [selectedJar]);

    const fetchJarTransactions = async (jarId) => {
        try {
            const response = await axios.get(`http://localhost:5000/user_jar_transactions/${userId}/${jarId}`);
            if (response.data.transactions) {
                setTransactions(response.data.transactions);
                console.log("Transactions fetched:", response.data.transactions); // Debugging log
            } else {
                console.error("Transactions not found in response");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Log state values for debugging
        console.log("Jar Name:", jarName);
        console.log("Allocated Amount:", allocatedAmount);
        console.log("Current Balance:", currentBalance);
        console.log("Target Amount:", targetAmount);
        console.log("Selected Account:", selectedAccount);
        console.log("User ID:", userId);
    
        if (!jarName || !allocatedAmount || !selectedAccount) {
            alert('Please fill in all required fields.');
            return;
        }
    
        // Construct the payload
        const payload = {
            user_id: userId,
            account_id: selectedAccount,
            jar_name: jarName,
            allocated_amount: parseFloat(allocatedAmount),
            current_balance: parseFloat(currentBalance) || parseFloat(allocatedAmount), // Default to allocated amount if current balance is empty
            target_amount: parseFloat(targetAmount) || null, // Ensure null if not provided
        };
    
        // Log the payload for debugging
        console.log("Payload:", payload);
    
        try {
            const response = await axios.post('http://localhost:5000/create_jar', payload);
    
            if (response.status === 201) {
                window.location.reload(); // Refresh the page to update dropdowns
            } else {
                console.error("Unexpected response status:", response.status);
                alert('Failed to create jar. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
            } else {
                console.error("Error creating jar:", error);
            }
        }
    };
    

    const handleEditJar = async () => {
        if (!selectedJar.jar_name) {
            alert('Jar name is required.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/update_jar/${selectedJar.jar_id}`, {
                jar_name: selectedJar.jar_name,
                target_amount: selectedJar.target_amount
            });

            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error("Error updating jar:", error);
        }
    };

    const handleDeleteJar = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete_jar/${selectedJar.jar_id}`);

            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error("Error deleting jar:", error);
        }
    };

    return (
        <div>
            <NavSideBar />
            <div className="main-container"> {/* Added this line */}
                <div className="content-container">
                    <div className='account-background'>
                        <h2 className="account-total-container">
                            <div className="account-total-label">Available Total:</div>
                            <div className="account-total">£{availableTotal.toFixed(2)}</div>
                            <div onClick={toggleAccountInfo} className="dropdown-arrow">
                                {isAccountInfoVisible ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                            <button className='create-jar-button' onClick={() => setShowModal(true)}>Create</button>
                        </h2>
                        {isAccountInfoVisible && (
                            <ul className='account-list-container'>
                                {accounts.map(account => (
                                    <li className="account-item" key={account.account_id}>
                                        {account.name}: £{account.available_funds.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="jar-carousel-container horizontal-carousel">
                        <Slider {...horizontalSettings} className="jar-container">
                            {jars.map(jar => (
                                <div className='jar' key={jar.jar_id} onClick={() => setSelectedJar(jar)}>
                                    <Lid />
                                    <span className="jar-name">{jar.jar_name}</span>
                                    <span className="jar-value">£{jar.current_balance.toFixed(2)}</span>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <VerticalCarousel jars={jars} setSelectedJar={setSelectedJar} />
                {selectedJar && (
                    <div className="jar-details">
                        <button className='edit-jar-button' onClick={() => setShowEditModal(true)}>Edit</button>
                        <h3 className="jar-details-name">{selectedJar.jar_name}</h3>
                        <h2 className="jar-details-balance">£{selectedJar.current_balance.toFixed(2)}</h2>
                        <div className="progress-bar-wrapper">
                            {selectedJar.current_balance < selectedJar.target_amount && (
                                <h4 className="jar-details-goal">£{selectedJar.target_amount}</h4>
                            )}
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ 
                                    width: `${Math.min((selectedJar.current_balance / selectedJar.target_amount) * 100, 100)}%`, 
                                    backgroundColor: selectedJar.current_balance >= selectedJar.target_amount ? 'green' : '#ffffff' 
                                }}>
                                    {selectedJar.current_balance >= selectedJar.target_amount && <span className="progress-completed">Completed</span>}
                                </div>
                            </div>
                            {selectedJar.current_balance < selectedJar.target_amount && (
                                <span className="progress-percentage">{((selectedJar.current_balance / selectedJar.target_amount) * 100).toFixed(2)}%</span>
                            )}
                        </div>
                        <div className="transactions-wrapper">
                            <div className="transactions-title-wrapper">
                                <h2>Transactions</h2>
                                <button type="button" className='add-transactions-button' onClick={() => setShowTransactionModal(true)}>+</button>
                            </div>
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th className="transactions-header">Date</th>
                                        <th className="transactions-header">Amount</th>
                                        <th className="transactions-header">Category</th>
                                        <th className="transactions-header">Description</th>
                                        <th className="transactions-header">Account total</th>
                                    </tr>
                                </thead>
                                <tbody className="transactions-body">
                                    {transactions.map(transaction => (
                                        <tr key={transaction.transaction_id} className="transactions-row">
                                            <td className="transactions-cell">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                                            <td className="transactions-cell">{transaction.amount}</td>
                                            <td className="transactions-cell">{transaction.category}</td>
                                            <td className="transactions-cell">{transaction.description}</td>
                                            <td className="transactions-cell">{transaction.post_account_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="overlay-container">
                    <div className="overlay-content">
                        <form onSubmit={handleSubmit}>
                            <div className="create-item">
                                <label>
                                    <select className='input-field-dropdown' value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} required>
                                        <option value="" disabled>Select account</option>
                                        {accounts.map((account, index) => (
                                            <option key={index} value={account.account_id}>
                                                {account.name} - £{(account.available_funds).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                <input
                                    className='input-field jar-form-input-field' 
                                    type="text" value={jarName} 
                                    onChange={(e) => setJarName(e.target.value)} required 
                                    placeholder='Jar Name'
                                />
                            </label>
                            </div>
                            <div className="create-item">
                                <label>
                                    <input 
                                        className='input-field jar-form-input-field' 
                                        type="number" 
                                        value={allocatedAmount} 
                                        onChange={(e) => setAllocatedAmount(e.target.value)} required 
                                        placeholder='Allocated Amount'
                                    />
                                </label>
                                <label>
                                    <input 
                                        className='input-field jar-form-input-field' 
                                        type="number" 
                                        value={targetAmount} 
                                        onChange={(e) => setTargetAmount(e.target.value)} 
                                        placeholder='Target Amount (optional)'
                                    />
                                </label>
                            </div>
                            <div className="create-button-wrapper">
                                <button className='jar-popup-button jar-popup-button--transparent' type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className='jar-popup-button' type="submit">Create Jar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditModal && selectedJar && (
                <div className="overlay-container">
                    <div className="overlay-content">
                        <form onSubmit={(e) => { e.preventDefault(); handleEditJar(); }}>
                        <button className='jar-popup-button jar-popup-button--transparent' type="button" onClick={handleDeleteJar}>Delete</button>
                            <div className="edit-content-wrapper">
                                <label>
                                <h2 className='edit-jar-header'>Jar Name</h2>
                                    <input
                                        type="text"
                                        value={selectedJar.jar_name}
                                        onChange={(e) => setSelectedJar({ ...selectedJar, jar_name: e.target.value })}
                                        required
                                        className='input-field jar-form-input-field'
                                    />
                                </label>
                                <label>
                                    <h2 className='edit-jar-header'>Jar Goal</h2>
                                    <input
                                        type="number"
                                        value={selectedJar.target_amount}
                                        onChange={(e) => setSelectedJar({ ...selectedJar, target_amount: e.target.value })}
                                        className='input-field jar-form-input-field'
                                    />
                                </label>
                            </div>
                            <div className="edit-jar-button-wrapper">
                                <button className="jar-popup-button jar-popup-button--transparent" type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className='jar-popup-button' type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showTransactionModal && selectedJar && (
                <TransactionForm
                    userId={userId}
                    accounts={accounts}
                    jars={jars}
                    selectedJar={selectedJar}
                    setSelectedJar={setSelectedJar} 
                    onClose={() => setShowTransactionModal(false)}
                    onSubmit={() => { window.location.reload(); }}
                    disableDropdowns={true} // Disable dropdowns when creating a transaction from the jars page
                />
            )}
        </div>
    );
}

export default JarScreen;
