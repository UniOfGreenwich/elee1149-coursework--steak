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
    const [sourceAccount, setSourceAccount] = useState('');
    const [destinationAccount, setDestinationAccount] = useState('');
    const [sourceJar, setSourceJar] = useState('');
    const [destinationJar, setDestinationJar] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [filteredJars, setFilteredJars] = useState([]);
    const [filteredSourceJars, setFilteredSourceJars] = useState([]);
    const [filteredDestinationJars, setFilteredDestinationJars] = useState([]);

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

    useEffect(() => {
        if (selectedAccount) {
            const accountJars = jars.filter(jar => jar.account_id === parseInt(selectedAccount));
            setFilteredJars(accountJars);
        } else {
            setFilteredJars([]);
        }
    }, [selectedAccount, jars]);

    useEffect(() => {
        if (sourceAccount) {
            const accountJars = jars.filter(jar => jar.account_id === parseInt(sourceAccount));
            setFilteredSourceJars(accountJars);
        } else {
            setFilteredSourceJars([]);
        }
    }, [sourceAccount, jars]);

    useEffect(() => {
        if (destinationAccount) {
            const accountJars = jars.filter(jar => jar.account_id === parseInt(destinationAccount));
            setFilteredDestinationJars(accountJars);
        } else {
            setFilteredDestinationJars([]);
        }
    }, [destinationAccount, jars]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            user_id: userId,
            account_id: selectedAccount,
            jar_id: selectedJar?.jar_id,
            amount: parseFloat(amount),
            transaction_type: transactionType,
            category,
            description,
            source_account_id: sourceAccount,
            destination_account_id: destinationAccount,
            source_jar_id: sourceJar?.jar_id,
            destination_jar_id: destinationJar?.jar_id,
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
        <div className="overlay-transactions-container">
            <div className="overlay-transactions-content">
                <form onSubmit={handleSubmit}>
                    <div className="create-item">
                        <label>
                            <select className='input-field-dropdown transaction-input-field' value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} required disabled={disableDropdowns}>
                                <option value="" disabled>Select account</option>
                                {accounts.map((account, index) => (
                                    <option key={index} value={account.account_id}>
                                        {account.name} - £{(account.available_funds).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select className='input-field-dropdown transaction-input-field' value={selectedJar?.jar_id || ''} onChange={(e) => setSelectedJar(filteredJars.find(jar => jar.jar_id === parseInt(e.target.value)))} disabled={disableDropdowns}>
                                <option value="" disabled>Select jar</option>
                                {filteredJars.map((jar, index) => (
                                    <option key={index} value={jar.jar_id}>
                                        {jar.jar_name} - £{(jar.current_balance).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="create-item">
                        <label>
                            <select className='input-field-dropdown transaction-input-field' value={transactionType} onChange={(e) => setTransactionType(e.target.value)} required>
                                <option value="ingoing">Ingoing</option>
                                <option value="outgoing">Outgoing</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </label>
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
                    {transactionType === 'transfer' && (
                        <>
                            <div className="create-item">
                                <label>
                                    <select className='input-field-dropdown transaction-input-field' value={sourceAccount} onChange={(e) => setSourceAccount(e.target.value)} required>
                                        <option value="" disabled>Select source account</option>
                                        {accounts.map((account, index) => (
                                            <option key={index} value={account.account_id}>
                                                {account.name} - £{(account.available_funds).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <select className='input-field-dropdown transaction-input-field' value={sourceJar?.jar_id || ''} onChange={(e) => setSourceJar(filteredSourceJars.find(jar => jar.jar_id === parseInt(e.target.value)))}>
                                        <option value="" disabled>Select source jar</option>
                                        {filteredSourceJars.map((jar, index) => (
                                            <option key={index} value={jar.jar_id}>
                                                {jar.jar_name} - £{(jar.current_balance).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="create-item">
                                <label>
                                    <select className='input-field-dropdown transaction-input-field' value={destinationAccount} onChange={(e) => setDestinationAccount(e.target.value)} required>
                                        <option value="" disabled>Select destination account</option>
                                        {accounts.map((account, index) => (
                                            <option key={index} value={account.account_id}>
                                                {account.name} - £{(account.available_funds).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <select className='input-field-dropdown transaction-input-field' value={destinationJar?.jar_id || ''} onChange={(e) => setDestinationJar(filteredDestinationJars.find(jar => jar.jar_id === parseInt(e.target.value)))}>
                                        <option value="" disabled>Select destination jar</option>
                                        {filteredDestinationJars.map((jar, index) => (
                                            <option key={index} value={jar.jar_id}>
                                                {jar.jar_name} - £{(jar.current_balance).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </>
                    )}
                    <div className="create-item bottom-row">
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
                        <button className='transaction-button transaction-button--transparent' type="button" onClick={onClose}>Cancel</button>
                        <button className='transaction-button' type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
