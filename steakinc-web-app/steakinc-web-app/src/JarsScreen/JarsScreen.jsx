import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './JarsScreen.css'; // Assuming your CSS is in this file

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
    const [transactions, setTransactions] = useState([]); // State for transactions related to the selected jar
    const location = useLocation();
    const userId = location.state?.userId;

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
                alert('Jar created successfully');
                window.location.reload(); // Refresh the page to update dropdowns
            } else {
                console.error("Unexpected response status:", response.status);
                alert('Failed to create jar. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
                alert(`Error: ${error.response.data.error}`);
            } else {
                console.error("Error creating jar:", error);
                alert('Failed to create jar. Please try again.');
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
                alert('Jar updated successfully');
                window.location.reload();
            } else {
                console.error("Unexpected response status:", response.status);
                alert('Failed to update jar. Please try again.');
            }
        } catch (error) {
            console.error("Error updating jar:", error);
            alert('Failed to update jar. Please try again.');
        }
    };

    const handleDeleteJar = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete_jar/${selectedJar.jar_id}`);

            if (response.status === 200) {
                alert('Jar deleted successfully');
                window.location.reload();
            } else {
                console.error("Unexpected response status:", response.status);
                alert('Failed to delete jar. Please try again.');
            }
        } catch (error) {
            console.error("Error deleting jar:", error);
            alert('Failed to delete jar. Please try again.');
        }
    };

    return (
        <div>
            <h1 className="white-text">Create a New Jar</h1>
            <button onClick={() => setShowModal(true)}>Open Jar Form</button>

            <div>
                <h2 className="white-text">Available Total: £{availableTotal.toFixed(2)}</h2>
                {accounts.map(account => (
                    <p className="white-text" key={account.account_id}>
                        {account.name}: £{account.available_funds.toFixed(2)}
                    </p>
                ))}
            </div>

            {selectedJar && (
                <div className="jar-details">
                    <h2 className="white-text">Jar Details</h2>
                    <p className="white-text">Jar Name: {selectedJar.jar_name}</p>
                    <p className="white-text">Current Balance: £{selectedJar.current_balance.toFixed(2)}</p>
                    <p className="white-text">Goal: {selectedJar.target_amount}</p>
                    <button onClick={() => setShowEditModal(true)}>Edit</button>
                </div>
            )}

            <div>
                <h2 className="white-text">Your Jars</h2>
                <ul className="white-text">
                    {jars.map(jar => (
                        <li key={jar.jar_id} onClick={() => setSelectedJar(jar)}>
                            {jar.jar_name}: Current Balance £{jar.current_balance.toFixed(2)}, Target £{(jar.target_amount ?? 0).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Jar Name:
                                <input type="text" value={jarName} onChange={(e) => setJarName(e.target.value)} required />
                            </label>
                            <br />
                            <label>
                                Allocated Amount:
                                <input type="number" value={allocatedAmount} onChange={(e) => setAllocatedAmount(e.target.value)} required />
                            </label>
                            <br />
                            <label>
                                Target Amount (optional):
                                <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Select Account:
                                <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} required>
                                    <option value="" disabled>Select account</option>
                                    {accounts.map((account, index) => (
                                        <option key={index} value={account.account_id}>
                                            {account.name} - £{(account.available_funds).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <br />
                            <button type="submit">Create Jar</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && selectedJar && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Jar</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditJar(); }}>
                            <label>
                                Jar Name:
                                <input
                                    type="text"
                                    value={selectedJar.jar_name}
                                    onChange={(e) => setSelectedJar({ ...selectedJar, jar_name: e.target.value })}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Target Amount:
                                <input
                                    type="number"
                                    value={selectedJar.target_amount}
                                    onChange={(e) => setSelectedJar({ ...selectedJar, target_amount: e.target.value })}
                                />
                            </label>
                            <br />
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={handleDeleteJar}>Delete Jar</button>
                            <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JarScreen;
