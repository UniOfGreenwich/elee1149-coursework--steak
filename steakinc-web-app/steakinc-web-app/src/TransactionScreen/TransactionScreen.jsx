import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function TransactionsScreen() {
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('ingoing');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [jars, setJars] = useState([]);
    const [selectedJar, setSelectedJar] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [transactions, setTransactions] = useState([]);
    
    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        if (!userId) {
            console.error("User ID is not defined");
            return;
        }

        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/total_balance/${userId}`);
                console.log("Accounts response:", response.data); // Debugging
                if (response.data.accounts) {
                    setAccounts(response.data.accounts);
                } else {
                    console.error("Accounts not found in response");
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user_transactions/${userId}`);
                console.log("Transactions response:", response.data); // Debugging
                if (response.data.transactions) {
                    setTransactions(response.data.transactions);
                } else {
                    console.error("Transactions not found in response");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchAccounts();
        fetchTransactions();
    }, [userId]);

    const handleAccountChange = async (accountId) => {
        setSelectedAccount(accountId);
        console.log("Selected account ID:", accountId); // Debugging
        try {
            const response = await axios.get(`http://localhost:5000/user_jars/${userId}`);
            console.log("Jars response:", response.data); // Debugging
            if (response.data.jars) {
                const filteredJars = response.data.jars.filter(jar => jar.account_id === parseInt(accountId));
                console.log("Filtered jars:", filteredJars); // Debugging
                setJars(filteredJars);
            } else {
                console.error("Jars not found in response");
            }
        } catch (error) {
            console.error("Error fetching jars:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!amount || !selectedAccount) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!userId) {
            alert('User ID is not defined.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/create_transaction', {
                user_id: userId,
                account_id: selectedAccount,
                jar_id: selectedJar || null,
                amount: parseFloat(amount),
                transaction_type: transactionType,
                category,
                description,
            });

            if (response.status === 201) {
                alert('Transaction added successfully');
                setShowModal(false);
                window.location.reload(); // Refresh the transactions list after adding a new one
            } else {
                console.error("Unexpected response status:", response.status);
                alert('Failed to add transaction. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
                alert(`Error: ${error.response.data.error}`);
            } else {
                console.error("Error adding transaction:", error);
                alert('Failed to add transaction. Please try again.');
            }
        }
    };

    // Sort transactions by date for the chart (ascending order)
    const sortedForChart = [...transactions].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
    console.log("Sorted transactions for chart:", sortedForChart);

    // Sort transactions by date for the table (descending order)
    const sortedForTable = [...transactions].sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    const chartData = {
        labels: sortedForChart.map(transaction => new Date(transaction.transaction_date).toLocaleDateString()),
        datasets: [
            {
                label: 'Post Account Total',
                data: sortedForChart.map(transaction => transaction.post_account_total),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div>
            <h1 className="white-text">Transactions</h1>
            <button onClick={() => setShowModal(true)}>Add Transaction</button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Amount:
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                            </label>
                            <br />
                            <label>
                                Transaction Type:
                                <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                                    <option value="ingoing">Ingoing</option>
                                    <option value="outgoing">Outgoing</option>
                                </select>
                            </label>
                            <br />
                            <label>
                                Select Account:
                                <select value={selectedAccount} onChange={(e) => handleAccountChange(e.target.value)} required>
                                    <option value="" disabled>Select account</option>
                                    {accounts.map(account => (
                                        <option key={account.account_id} value={account.account_id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <br />
                            {selectedAccount && (
                                <label>
                                    Select Jar (optional):
                                    <select value={selectedJar} onChange={(e) => setSelectedJar(e.target.value)}>
                                        <option value="">None</option>
                                        {jars.map(jar => (
                                            <option key={jar.jar_id} value={jar.jar_id}>
                                                {jar.jar_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                            <br />
                            <label>
                                Category:
                                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Description:
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </label>
                            <br />
                            <button type="submit">Add Transaction</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="white-text">Transaction List</h2>
            <table className="white-text">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Pre Account Total</th>
                        <th>Post Account Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedForTable.map(transaction => (
                        <tr key={transaction.transaction_id}>
                            <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.pre_account_total}</td>
                            <td>{transaction.post_account_total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="white-text">Post Account Total Over Time</h2>
            <Line data={chartData} />
        </div>
    );
}

export default TransactionsScreen;