import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './DashboardScreen.css'; // Import the CSS file

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const [totalBalance, setTotalBalance] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [newsHeadlines, setNewsHeadlines] = useState([]);
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountSummary = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:5000/total_balance/${userId}`);
                    setTotalBalance(parseFloat(response.data.total_balance));
                    setAccounts(response.data.accounts); // Set account details
                } catch (error) {
                    console.error("Error fetching account summary:", error);
                }
            } else {
                console.error("User ID is not defined");
            }
        };

        const fetchNewsHeadlines = async () => {
            try {
                const response = await axios.get('https://newsapi.org/v2/everything', {
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
                console.error("Error fetching financial news headlines:", error);
            }
        };
        fetchAccountSummary();
        fetchNewsHeadlines()
    }, [userId]);

    const formatNumber = (number) => {
        return number.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const pieData = {
        labels: accounts.map(account => account.name),
        datasets: [{
            data: accounts.map(account => account.balance),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#8A2BE2',
                '#FF4500',
                '#00CED1',
                '#ADFF2F'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#8A2BE2',
                '#FF4500',
                '#00CED1',
                '#ADFF2F'
            ],
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
                    color: 'white' // Make the legend text white
                }
            }
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
            <div style={{ width: '50%', height: '400px', margin: '0 auto' }}>
                <Pie data={pieData} options={pieOptions} />
            </div>

            <h3 className="white-text">Top Financial News:</h3>
            <ul>
                {newsHeadlines.map((article, index) => (
                    <li key={index} className="white-text">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="white-text">
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>

            {/* New Navigation Buttons */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={() => navigate('/jars', { state: { userId } })} style={{ marginRight: '10px' }}>Go to Jars</button>
                <button onClick={() => navigate('/transactions', { state: { userId } })}>Go to Transactions</button>
            </div>
        </div>
    );
}

export default Dashboard;
