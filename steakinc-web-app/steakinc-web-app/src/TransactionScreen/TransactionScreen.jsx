import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2'; // Import Pie chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Required for ChartJS
import TransactionsChart from '../components/TransactionsChart';
import TransactionForm from '../components/TransactionForm'; // Import the TransactionForm component
import NavSideBar from '../JarsScreen/NavSideBar';
import './TransactionScreen.css';

ChartJS.register(ArcElement, Tooltip, Legend); // Register ChartJS components

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
    const [pieChartData, setPieChartData] = useState(null); // State for pie chart data
    
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
                console.log("Transactions response:", response.data);
                if (response.data.transactions) {
                    setTransactions(response.data.transactions);
                    generatePieChartData(response.data.transactions); // Generate pie chart data
                } else {
                    console.error("Transactions not found in response");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
    
        const fetchJars = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user_jars/${userId}`);
                console.log("Jars response:", response.data);
                if (response.data.jars) {
                    setJars(response.data.jars); // Set all jars
                } else {
                    console.error("Jars not found in response");
                }
            } catch (error) {
                console.error("Error fetching jars:", error);
            }
        };
    
        fetchAccounts();
        fetchTransactions();
        fetchJars(); // Fetch jars immediately

    
    }, [userId]);    

    const generatePieChartData = (transactions) => {
        const categoryTotals = transactions.reduce((acc, transaction) => {
            const { category, amount } = transaction;
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {});

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        setPieChartData({
            labels,
            datasets: [
                {
                    label: 'Transaction Categories',
                    data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                },
            ],
        });
    };

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

    const handleSubmit = async () => {
        setShowModal(false);
        window.location.reload(); // Refresh the transactions list after adding a new one
    };

    return (
        <div className='transation-wrapper'>
            <NavSideBar />
            <div className='transaction-container'>
                {showModal && (
                    <TransactionForm
                        userId={userId}
                        selectedJar={selectedJar}
                        setSelectedJar={setSelectedJar} 
                        accounts={accounts}
                        jars={jars}
                        onClose={() => setShowModal(false)}
                        onSubmit={handleSubmit}
                        disableDropdowns={false} // Allow dropdowns to be editable
                    />
                )}
                <h2 className="line-chart-title">Account Total Over Time</h2>
                <div className="transactions-chart-container">
                    <TransactionsChart transactions={transactions} />
                    <div className="transactions-placeholder">
                        {pieChartData ? (
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        ) : (
                            <p>Loading chart...</p>
                        )}
                    </div>
                </div>
                <div className="transaction-table-add-container">
                    <h2 className="transaction-table-title">Transaction List</h2>
                    <button className='add-transaction-button' onClick={() => setShowModal(true)}>Add</button>
                </div>
                <div className="transaction-table-wrapper">
                    <table className="transaction-table-container">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Account Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.transaction_id}>
                                    <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                                    <td className={transaction.type === 'ingoing' ? 'transaction-type-ingoing' : 'transaction-type-outgoing'}>
                                        {transaction.type === 'ingoing' ? `+£${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-£${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                    </td>
                                    <td className={transaction.type === 'ingoing' ? 'transaction-type-ingoing' : 'transaction-type-outgoing'}>
                                        {transaction.type}
                                    </td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.description}</td>
                                    <td>£{transaction.post_account_total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TransactionsScreen;
