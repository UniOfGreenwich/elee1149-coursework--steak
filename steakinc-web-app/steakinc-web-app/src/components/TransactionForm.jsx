import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionForm = ({ userId, selectedJar, accounts, jars, onClose, onSubmit, disableDropdowns }) => {
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('ingoing');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (selectedJar) {
            setSelectedAccount(selectedJar.account_id);
        }
    }, [selectedJar]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            user_id: userId,
            account_id: selectedAccount,
            jar_id: selectedJar.jar_id,
            amount: parseFloat(amount),
            transaction_type: transactionType,
            category,
            description,
        };

        try {
            const response = await axios.post('http://localhost:5000/create_transaction', payload);
            if (response.status === 201) {
                onSubmit();
                onClose();
            } else {
                console.error("Unexpected response status:", response.status);
                alert('Failed to create transaction. Please try again.');
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };

    return (
        <div className="overlay-container">
            <div className="overlay-content">
                <form onSubmit={handleSubmit}>
                    <div className="create-item">
                        <label>
                            <select className='input-field-dropdown' value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} required disabled={disableDropdowns}>
                                <option value="" disabled>Select account</option>
                                {accounts.map((account, index) => (
                                    <option key={index} value={account.account_id}>
                                        {account.name} - £{(account.available_funds).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select className='input-field-dropdown' value={selectedJar?.jar_id || ''} onChange={(e) => setSelectedJar(jars.find(jar => jar.jar_id === e.target.value))} disabled={disableDropdowns}>
                                <option value="" disabled>Select jar</option>
                                {jars.map((jar, index) => (
                                    <option key={index} value={jar.jar_id}>
                                        {jar.jar_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="create-item">
                        <label>
                            <select className='input-field-dropdown' value={transactionType} onChange={(e) => setTransactionType(e.target.value)} required>
                                <option value="ingoing">Ingoing</option>
                                <option value="outgoing">Outgoing</option>
                            </select>
                        </label>
                        <label>
                            <input
                                className='input-field jar-form-input-field'
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder='Amount'
                            />
                        </label>
                        <label>
                            <input
                                className='input-field jar-form-input-field'
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                placeholder='Category'
                            />
                        </label>
                    </div>
                    <div className="create-item">
                        <label>
                            <input
                                className='input-field jar-form-input-field'
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder='Description'
                            />
                        </label>
                    </div>
                    <div className="create-button-wrapper">
                        <button className='jar-popup-button jar-popup-button--transparent' type="button" onClick={onClose}>Cancel</button>
                        <button className='jar-popup-button' type="submit">Create Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;