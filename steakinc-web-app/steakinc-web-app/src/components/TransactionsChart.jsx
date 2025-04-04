import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const TransactionsChart = ({ transactions = [] }) => {
    // Sort transactions by date for the chart (ascending order)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));

    const chartData = {
        labels: sortedTransactions.map(transaction => new Date(transaction.transaction_date).toLocaleDateString()),
        datasets: [
            {
                label: 'Post Account Total',
                data: sortedTransactions.map(transaction => transaction.post_account_total),
                fill: false,
                borderColor: 'rgb(218, 66, 89)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="line-chart-container">
            <Line data={chartData} />
        </div>
    );
};

export default TransactionsChart;