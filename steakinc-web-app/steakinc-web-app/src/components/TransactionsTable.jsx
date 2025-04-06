import React from 'react';
import './TransactionsTable.css';

const TransactionsTable = ({ transactions }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    return (
        <div className="transaction-table-wrapper">
            <h3 className='transaction-table-title'>Recent Transactions</h3>
            <table className="transaction-table-container">
                <thead>
                    <tr>
                        <th className='transaction-table-column'>Type</th>
                        <th className='transaction-table-column'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTransactions.map(transaction => (
                        <tr key={transaction.transaction_id} className='transaction-table-row'>
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