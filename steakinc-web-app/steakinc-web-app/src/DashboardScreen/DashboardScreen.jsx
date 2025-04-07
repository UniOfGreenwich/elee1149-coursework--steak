import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import TransactionsChart from '../components/TransactionsChart';
import TransactionsTable from '../components/TransactionsTable';
import './DashboardScreen.css'; // Import the CSS file
import NavSideBar from '../JarsScreen/NavSideBar';
import Lid from '../JarsScreen/Lid';

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

        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user_transactions/${userId}`);
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        const fetchJars = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user_jars/${userId}`);
                setJars(response.data.jars);
            } catch (error) {
                console.error("Error fetching jars:", error);
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
            const response = await axios.get(`http://localhost:5000/export_data/${userId}`, {
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

    const FeaturedJarsMobile = ({jars}) => {
        const featuredJars = jars.slice(0, 3);

        return (
            <div className="featured-jars-container mobile">
                <div className="jar-dashboard-container">
                    {featuredJars.map(jar => (
                    <div className='jar jars-dashboard' key={jar.jar_id}>
                        <Lid />
                        <span className="jar-name">{jar.jar_name}</span>
                        <span className="jar-value">£{jar.current_balance.toFixed(2)}</span>
                    </div>
                ))}
                </div>
        </div>
        )
    }

    const FeaturedJarsDesktop = ({jars}) => {
        const featuredJars = jars.slice(0, 4);

        return (
            <div className="featured-jars-container desktop">
                <div className="jar-dashboard-container">
                    {featuredJars.map(jar => (
                    <div className='jar jars-dashboard' key={jar.jar_id}>
                        <Lid />
                        <span className="jar-name">{jar.jar_name}</span>
                        <span className="jar-value">£{jar.current_balance.toFixed(2)}</span>
                    </div>
                ))}
                </div>
        </div>
        )
    }

    return (
        <div className='dashboard-wrapper'>
            <NavSideBar />
            <div className="dashboard-header-wrapper">
                <div className="dashboard-section-wrapper">
                    <ul className='dashboard-total-balance-container'>
                        <div className="dashboard-total-balance-title">Total Assets:</div>
                        <li className='dashboard-total-balance'>£{totalBalance}</li>
                    </ul>
                </div>
                <FeaturedJarsMobile jars={jars} setJars={setJars} />
                <FeaturedJarsDesktop jars={jars} setJars={setJars} />
            </div>
            <div className="dashboard-transaction-chart-container dashboard-screen-chart">
                <div className="dashboard-line-chart">
                    <TransactionsChart transactions={transactions} />
                </div>
            </div>
            <div className="recent-transactions-mobile">
                <TransactionsTable transactions={transactions} />
            </div>
            <div className="dashboard-section-right">
                <div className="recent-transactions-desktop">
                    <TransactionsTable transactions={transactions} />
                </div>
                <ul className='financial-news-container financial-desktop'>
                    <h3 className="financial-news-title">Top Financial News:</h3>
                    {newsHeadlines.map((article, index) => (
                        <li key={index} className="financial-news-item">
                            <h4 className='financial-news-header'>{article.author}</h4>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="financial-news-link">
                                {article.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <ul className='financial-news-container financial-mobile'>
                <h3 className="financial-news-title">Top Financial News:</h3>
                {newsHeadlines.map((article, index) => (
                    <li key={index} className="financial-news-item">
                        <h4 className='financial-news-header'>{article.author}</h4>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="financial-news-link">
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
