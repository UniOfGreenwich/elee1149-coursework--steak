import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionForm.css'; // Import CSS

const TransactionForm = ({ 
    userId, 
    selectedJar, 
    setSelectedJar, // New function to update selectedJar in parent
    accounts, 
    jars, 
    onClose, 
    onSubmit, 
    disableDropdowns 
}) => {
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('ingoing');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // Debug: Check if jars array is populated
    useEffect(() => {
        console.log("Jars data:", jars);
    }, [jars]);

    // Set default account when jar is selected
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
            jar_id: selectedJar?.jar_id, // Ensure it's not undefined
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
                        {/* Account Selection */}
                        <label>
                            <select 
                                className='input-field-dropdown transaction-input-field' 
                                value={selectedAccount} 
                                onChange={(e) => setSelectedAccount(e.target.value)} 
                                required 
                                disabled={disableDropdowns}
                            >
                                <option value="" disabled>Select account</option>
                                {accounts.map((account) => (
                                    <option key={account.account_id} value={account.account_id}>
                                        {account.name} - £{(account.available_funds).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* Jar Selection */}
                        <label>
                            <select 
                                className='input-field-dropdown transaction-input-field' 
                                value={selectedJar?.jar_id || ''} 
                                onChange={(e) => {
                                    console.log("Selected Jar ID:", e.target.value); // Debugging log
                                    const newJar = jars.find(jar => jar.jar_id.toString() === e.target.value);
                                    if (newJar) {
                                        console.log("Selected Jar Object:", newJar); // Debugging log
                                        setSelectedJar(newJar); // ✅ Ensure state is updated
                                    }
                                }} 
                                disabled={disableDropdowns}
                            >
                                <option value="" disabled>Select jar</option>
                                {jars
                                    .filter(jar => jar.account_id.toString() === selectedAccount.toString()) // Ensure correct filtering
                                    .map((jar) => (
                                        <option key={jar.jar_id} value={jar.jar_id}>
                                            {jar.jar_name} - £{jar.current_balance.toFixed(2)}
                                        </option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>

                    <div className="create-item">
                        {/* Transaction Type Selection */}
                        <label>
                            <select 
                                className='input-field-dropdown transaction-input-field' 
                                value={transactionType} 
                                onChange={(e) => setTransactionType(e.target.value)} 
                                required
                            >
                                <option value="ingoing">Ingoing</option>
                                <option value="outgoing">Outgoing</option>
                            </select>
                        </label>

                        {/* Amount Input */}
                        <label>
                            <input
                                className='input-field transaction-input-field'
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder='Amount'
                            />
                        </label>
                    </div>

                    <div className="create-item bottom-row">
                        {/* Category Input */}
                        <label>
                            <input
                                className='input-field transaction-input-field'
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                placeholder='Category'
                            />
                        </label>

                        {/* Description Input */}
                        <label>
                            <input
                                className='input-field transaction-input-field'
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder='Description'
                            />
                        </label>
                    </div>

                    <div className="create-button-wrapper">
                        <button 
                            className='transaction-button transaction-button--transparent' 
                            type="button" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button className='transaction-button' type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
