import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import TransactionsChart from '../components/TransactionsChart';
import TransactionsTable from '../components/TransactionsTable';
import './DashboardScreen.css'; // Import the CSS file

function Dashboard() {
    const [totalBalance, setTotalBalance] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [jars, setJars] = useState([]);
    const [newsHeadlines, setNewsHeadlines] = useState([]);
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountSummary = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`https://plasma-torus-454810-h1.lm.r.appspot.com/total_balance/${userId}`);
                    setTotalBalance(parseFloat(response.data.total_balance));
                    setAccounts(response.data.accounts); // Set account details
                } catch (error) {
                    console.error("Error fetching account summary:", error);
                }
            } else {
                console.error("User ID is not defined");
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

        const fetchJars = async () => {
            try {
                const response = await axios.get(`https://plasma-torus-454810-h1.lm.r.appspot.com/user_jars/${userId}`);
                setJars(response.data.jars);
            } catch (error) {
                console.error("Error fetching jars:", error);
            }
        };

        const fetchNewsHeadlines = async () => {
            try {
                const response = await axios.get('httpss://newsapi.org/v2/everything', {
                    params: {
                        q: 'finance OR Stocks', // Search for finance-related articles
                        language: 'en', // Specify the language
                        sortBy: 'publishedAt', // Sort by publication date
                        pageSize: 5, // Limit to top 5 articles
                        apiKey: '09c5c716973d4cb2a3ab5ca36bbe8bd2' // Replace with your actual API key
                    }
                });
                setNewsHeadlines(response.data.articles);
            } catch (error) {
                console.error("Error fetching news headlines:", error);
            }
        };

        fetchAccountSummary();
        fetchTransactions();
        fetchJars();
        fetchNewsHeadlines();
    }, [userId]);

    const formatNumber = (number) => {
        return number.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleExportData = async () => {
        try {
            const response = await axios.get(`https://plasma-torus-454810-h1.lm.r.appspot.com/export_data/${userId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_data.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    return (
        <div>
            <h1 className="white-text">Dashboard</h1>
            <h2 className="white-text">Total Balance: {totalBalance !== null && !isNaN(totalBalance) ? `£${formatNumber(totalBalance)}` : 'Loading...'}</h2>
            <h3 className="white-text">Accounts Breakdown:</h3>
            <ul>
                {accounts.map((account, index) => (
                    <li key={index} className="white-text">
                        {account.name}: £{formatNumber(account.balance)}
                    </li>
                ))}
            </ul>
            <h3 className="white-text">Jars:</h3>
            <ul>
                {jars.map((jar, index) => (
                    <li key={index} className="white-text">
                        {jar.jar_name}: £{formatNumber(jar.current_balance)}
                    </li>
                ))}
            </ul>
            <h3 className="white-text">Transactions Over Time:</h3>
            <TransactionsChart transactions={transactions} />
            <h3 className="white-text">Recent Transactions:</h3>
            <TransactionsTable transactions={transactions} />

            <h3 className="white-text">Top Financial News:</h3>
            <ul>
                {newsHeadlines.map((article, index) => (
                    <li key={index} className="white-text">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="white-text">
                            {article.author}, {article.title}
                        </a>
                    </li>
                ))}
            </ul>

            {/* New Navigation Buttons */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={() => navigate('/jars', { state: { userId } })} style={{ marginRight: '10px' }}>Go to Jars</button>
                <button onClick={() => navigate('/transactions', { state: { userId } })}>Go to Transactions</button>
                <button onClick={() => navigate('/accounts', { state: { userId } })}>Go to Accounts</button>
                <button onClick={() => navigate('/budget', { state: { userId } })}>Go to Budget</button>
                <button onClick={handleExportData} style={{ marginLeft: '10px' }}>Export Data</button>
            </div>
        </div>
    );
}

export default Dashboard;
