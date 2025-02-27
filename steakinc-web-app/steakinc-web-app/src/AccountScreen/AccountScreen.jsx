import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './AccountScreen.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function AccountsScreen() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/total_balance/${userId}`);
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

        fetchAccounts();
    }, [userId]);

    const handleCreateAccount = async (newAccount) => {
        try {
            const response = await axios.post('http://localhost:5000/create_account', {
                user_id: userId,
                ...newAccount
            });
            if (response.status === 201) {
                alert('Account created successfully');
                setAccounts([...accounts, { ...newAccount, account_id: response.data.account_id }]);
                setShowCreateModal(false);
                window.location.reload(); // Refresh the page 
            }
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    const handleEditAccount = async (updatedAccount) => {
        try {
            const response = await axios.put(`http://localhost:5000/update_account/${selectedAccount.account_id}`, updatedAccount);
            if (response.status === 200) {
                alert('Account updated successfully');
                setAccounts(accounts.map(account => account.account_id === selectedAccount.account_id ? { ...selectedAccount, ...updatedAccount } : account));
                setShowEditModal(false);
                window.location.reload(); // Refresh the page 
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
            const response = await axios.delete(`http://localhost:5000/delete_account/${selectedAccount.account_id}`);
            if (response.status === 200) {
                alert('Account and related jars deleted successfully');
                const updatedAccounts = accounts.filter(account => account.account_id !== selectedAccount.account_id);
                setAccounts(updatedAccounts);
                setSelectedAccount(updatedAccounts.length > 0 ? updatedAccounts[0] : null);
                setShowDeleteConfirmation(false);
                setShowEditModal(false);
                window.location.reload(); // Refresh the page 
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
            <h1 className="white-text">Accounts</h1>
            <button onClick={() => setShowCreateModal(true)}>Create Account</button>
            <div class="white-text">
                {accounts.map(account => (
                    <div key={account.account_id} onClick={() => setSelectedAccount(account)}>
                        <p>{account.name}: £{account.balance}</p>
                    </div>
                ))}
            </div>
            {selectedAccount && (
                <div class="white-text">
                    <h2>Account Details</h2>
                    <p>Name: {selectedAccount.name}</p>
                    <p>Type: {selectedAccount.account_type}</p>
                    <p>Balance: £{selectedAccount.balance}</p>
                    <button onClick={() => setShowEditModal(true)}>Edit</button>
                </div>
            )}
            <div style={{ width: '50%', height: '400px', margin: '0 auto' }}>
                <Pie data={pieData} options={pieOptions} />
            </div>
            {showEditModal && selectedAccount && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Account</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditAccount({ account_name: selectedAccount.name, account_type: selectedAccount.account_type }); }}>
                            <label>
                                Account Name:
                                <input type="text" value={selectedAccount.name} onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })} required />
                            </label>
                            <br />
                            <label>
                                Account Type:
                                <input type="text" value={selectedAccount.account_type} onChange={(e) => setSelectedAccount({ ...selectedAccount, account_type: e.target.value })} required />
                            </label>
                            <br />
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setShowDeleteConfirmation(true)}>Delete Account</button>
                            <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteConfirmation && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Delete Account</h2>
                        <p>All jars related to this account will be deleted. Would you like to continue?</p>
                        <button onClick={handleDeleteAccount}>Continue</button>
                        <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create Account</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount({ account_name: e.target.account_name.value, account_type: e.target.account_type.value, balance: e.target.balance.value }); }}>
                            <label>
                                Account Name:
                                <input type="text" name="account_name" required />
                            </label>
                            <br />
                            <label>
                                Account Type:
                                <input type="text" name="account_type" required />
                            </label>
                            <br />
                            <label>
                                Balance:
                                <input type="number" name="balance" required />
                            </label>
                            <br />
                            <button type="submit">Create Account</button>
                            <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
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
    );
}

export default AccountsScreen;
