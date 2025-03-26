import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './AccountScreen.css';
import NavSideBar from '../JarsScreen/NavSideBar';
import TransactionsChart from '../components/TransactionsChart';
import VerticalCarouselAccounts from './VerticalCarouselAccounts';
import useWindowDimensions from './useWindowDimensions';
import HorizontalCarouselAccounts from './HorizontalCarouselAccounts';

ChartJS.register(ArcElement, Tooltip, Legend);

function AccountsScreen() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactions, setTransactions] = useState([]);
    const { width } = useWindowDimensions();
    const location = useLocation();
    const userId = location.state?.userId;

    const fetchAccounts = async () => {
        try {
            const response = await axios.get(`https://plasma-torus-454810-h1.lm.r.appspot.com/total_balance/${userId}`);
            const fetchedAccounts = response.data.accounts;
            setAccounts(fetchedAccounts);

            // Set the first account as the default selected account
            if (fetchedAccounts.length > 0) {
                setSelectedAccount(fetchedAccounts[0]);
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`https://plasma-torus-454810-h1.lm.r.appspot.com/user_transactions/${userId}`);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchAccounts();
    }, [userId]);

    const handleCreateAccount = async (newAccount) => {
        try {
            const response = await axios.post('https://plasma-torus-454810-h1.lm.r.appspot.com/create_account', {
                user_id: userId,
                ...newAccount
            });
            if (response.status === 201) {
                alert('Account created successfully');
                await fetchAccounts(); // Fetch updated data
                await fetchTransactions();
                setShowCreateModal(false); // Close modal
            }
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    const handleEditAccount = async (updatedAccount) => {
        try {
            const response = await axios.put(`https://plasma-torus-454810-h1.lm.r.appspot.com/update_account/${selectedAccount.account_id}`, updatedAccount);
            if (response.status === 200) {
                alert('Account updated successfully');
                await fetchAccounts(); // Fetch updated data
                setShowEditModal(false); // Close modal
            }
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const handleDeleteAccount = async () => {
        if (accounts.length <= 1) {
            setErrorMessage('At least one account is necessary at all times.');
            setShowDeleteConfirmation(false);
            return;
        }

        try {
            const response = await axios.delete(`https://plasma-torus-454810-h1.lm.r.appspot.com/delete_account/${selectedAccount.account_id}`);
            if (response.status === 200) {
                alert('Account and related jars deleted successfully');
                await fetchAccounts(); // Fetch updated data
                await fetchTransactions();
                setShowDeleteConfirmation(false); // Close modal
                setShowEditModal(false); // Close modal
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const pieData = {
        labels: accounts.map(account => account.name),
        datasets: [{
            data: accounts.map(account => account.balance),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
            borderColor: '#fff',
            hoverBorderColor: '#fff'
        }]
    };

    const pieOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            }
        }
    };

    return (
        <div>
            <NavSideBar />
            <div className="accounts-wrapper">
                <div className="account-summary-container">
                    <div className="account-selected-container">
                        {selectedAccount && (
                            <div className="account-selected-item">
                                <p className='account-selected-title'>{selectedAccount.name}</p>
                                <p className='account-selected-balance'>£{selectedAccount.balance}</p>
                                <div className="account-selected-button-container">
                                    <button className='account-selected-create-button' onClick={() => setShowCreateModal(true)}>Create</button>
                                    <button className='account-selected-edit-button' onClick={() => setShowEditModal(true)}>Edit</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pie-chart-container">
                        <div className="pie-chart">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>
                </div>
                <div className="accounts-transaction-chart-container">
                    <div className="accounts-transaction-chart">
                        <TransactionsChart transactions={transactions} />
                    </div>
                </div>
                {width >= 1024 ? (
                    <VerticalCarouselAccounts accounts={accounts} setSelectedAccount={setSelectedAccount} />
                ) : (
                    <HorizontalCarouselAccounts accounts={accounts} setSelectedAccount={setSelectedAccount} />
                )}
                {showEditModal && selectedAccount && (
                    <div className="edit-account-overlay">
                        <div className="edit-account-content">
                            <h2 className='edit-account-title'>Edit Account</h2>
                            <form className='edit-account-form' onSubmit={(e) => { e.preventDefault(); handleEditAccount({ account_name: selectedAccount.name, account_type: selectedAccount.account_type }); }}>
                                <label>
                                    Account Name
                                    <input className='input-field' type="text" value={selectedAccount.name} onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })} required />
                                </label>
                                <br />
                                <label>
                                    Account Type
                                    <input className='input-field' type="text" value={selectedAccount.account_type} onChange={(e) => setSelectedAccount({ ...selectedAccount, account_type: e.target.value })} required />
                                </label>
                                <br />
                                <div className="edit-account-button-container">
                                    <button className='edit-account-cancel-button' type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button className='edit-account-delete-button' type="button" onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
                                    <button className='edit-account-submit-button' type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showDeleteConfirmation && (
                    <div className="delete-account-overlay">
                        <div className="delete-account-content">
                            <h2>Delete Account</h2>
                            <p>All jars related to this account will be deleted. Would you like to continue?</p>
                            <button className='delete-account-cancel-button' onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                            <button className='delete-account-submit-button' onClick={handleDeleteAccount}>Continue</button>
                        </div>
                    </div>
                )}
                {showCreateModal && (
                    <div className="create-account-overlay">
                        <div className="create-account-content">
                            <h2>Create Account</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount({ account_name: e.target.account_name.value, account_type: e.target.account_type.value, balance: e.target.balance.value }); }}>
                                <label>
                                    <input className='input-field' type="text" name="account_name" placeholder='Account Name' required />
                                </label>
                                <br />
                                <label>
                                    <input className='input-field' type="text" name="account_type" placeholder='Account Type' required />
                                </label>
                                <br />
                                <label>
                                    <input className='input-field' type="number" name="balance" placeholder='Balance' required />
                                </label>
                                <br />
                                <div className="create-account-button-container">
                                    <button className='create-account-cancel-button' type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button className='create-account-submit-button' type="submit">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="error-message">
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage('')}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountsScreen;