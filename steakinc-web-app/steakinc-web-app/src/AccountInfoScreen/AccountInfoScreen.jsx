import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function AccountInformationForm() {
    const [accounts, setAccounts] = useState([{ accountName: '', accountType: '', balance: '', monthlyIncome: '' }]);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId; // Get userId from the state passed during navigation

    const handleAddAccount = () => {
        setAccounts([...accounts, { accountName: '', accountType: '', balance: '', monthlyIncome: '' }]);
    };

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
        <form onSubmit={handleSubmit}>
            {accounts.map((account, index) => (
                <div key={index}>
                    <input
                        type="text"
                        name="accountName"
                        placeholder="Account Name"
                        value={account.accountName}
                        onChange={(e) => handleAccountChange(index, e)}
                        required
                    />
                    <input
                        type="text"
                        name="accountType"
                        placeholder="Account Type"
                        value={account.accountType}
                        onChange={(e) => handleAccountChange(index, e)}
                        required
                    />
                    <input
                        type="number"
                        name="balance"
                        placeholder="Balance"
                        value={account.balance}
                        onChange={(e) => handleAccountChange(index, e)}
                        required
                    />
                    <input
                        type="number"
                        name="monthlyIncome"
                        placeholder="Monthly Income"
                        value={account.monthlyIncome}
                        onChange={(e) => handleAccountChange(index, e)}
                        required
                    />
                </div>
            ))}
            <button type="button" onClick={handleAddAccount}>Add Another Account</button>
            <button type="submit">Submit</button>
        </form>
    );
}

export default AccountInformationForm;
