import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './AccountInfoScreen.css'
 
function AccountInformationForm() {
    const [accounts, setAccounts] = useState([{ accountName: '', accountType: '', balance: '', monthlyIncome: '' }]);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId; // Get userId from the state passed during navigation
 
    const handleBackClick = () => {
        navigate('/');
    };
 
    const handleAddAccount = () => {
        setAccounts([...accounts, { accountName: '', accountType: '', balance: '', monthlyIncome: '' }]);
    };

    const handleRemoveAccount = () => {
        if (accounts.length > 1) {
            setAccounts(accounts.slice(0, -1));
        }
    }
 
    const handleAccountChange = (index, event) => {
        const newAccounts = accounts.map((account, i) =>
            i === index ? { ...account, [event.target.name]: event.target.value } : account
        );
        setAccounts(newAccounts);
    };
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            for (const account of accounts) {
                await axios.post('http://localhost:5000/setup', {
                    userId, // Make sure userId is included
                    ...account
                });
            }
            await axios.post(`http://localhost:5000/update_new_status/${userId}`, { new: false });
            navigate('/');  // Redirect to user dashboard
        } catch (error) {
            console.error('Error submitting account information', error);
        }
    };
 
    return (
        <>
         <div className="account-title-wrapper">
                <img src="/src/assets/highsteaks.png" alt="High Steaks Logo" className="account-logo" />
                <h1 className="account-title-text">Steak</h1>
        </div>
        <div className="account-message-wrapper">
            <p className='account-message-text'>Welcome! To get started, please enter your account details:</p>
        </div>
            <div className="account-form-container">
                <form className='account-form-wrapper' onSubmit={handleSubmit}>
                    {accounts.map((account, index) => (
                        <div key={index}>
                            <div className="account-form-item">
                                <input
                                    type="text"
                                    name="accountName"
                                    placeholder="Account Name"
                                    value={account.accountName}
                                    onChange={(e) => handleAccountChange(index, e)}
                                    required
                                    className='input-field account-name-input'
                                />
                            </div>
                            <div className="account-form-item">
                            <input
                                    type="number"
                                    name="balance"
                                    placeholder="Balance"
                                    value={account.balance}
                                    onChange={(e) => handleAccountChange(index, e)}
                                    required
                                    className='input-field account-amount-input'
                                />
                                <input
                                    type="text"
                                    name="accountType"
                                    placeholder="Account Type"
                                    value={account.accountType}
                                    onChange={(e) => handleAccountChange(index, e)}
                                    required
                                    className='input-field account-type-input'
                                />
                            </div>
                        </div>
                    ))}
                    <div className="account-button-wrapper">
                        <button type="button" className='add-account-button'  onClick={handleAddAccount}>+</button>
                        <button type="button" className='remove-account-button'  onClick={handleRemoveAccount}>-</button>
                    </div>
                </form>
            </div>
            <div className="button-wrapper">
                <button className='back-button' onClick={handleBackClick}>Back</button>
                <button className='login-submit-button' onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
}
 
export default AccountInformationForm;
