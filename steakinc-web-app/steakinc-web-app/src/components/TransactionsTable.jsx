import React from 'react';
import './TransactionsTable.css';

const TransactionsTable = ({ transactions }) => {
    // Sort transactions by date for the table (descending order)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    return (
        <div className="transaction-table-wrapper">
            <table className="transaction-table-container">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTransactions.map(transaction => (
                        <tr key={transaction.transaction_id}>
                            <td className={transaction.type === 'ingoing' ? 'transaction-type-ingoing' : 'transaction-type-outgoing'}>
                                {transaction.type}
                            </td>
                            <td className={transaction.type === 'ingoing' ? 'transaction-type-ingoing' : 'transaction-type-outgoing'}>
                                {transaction.type === 'ingoing' ? `+£${transaction.amount}` : `-£${transaction.amount}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;