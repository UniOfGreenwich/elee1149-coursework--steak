import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './BudgetScreen.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetScreen() {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
    const [incomeName, setIncomeName] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [expenseName, setExpenseName] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        fetchIncomes();
        fetchExpenses();
    }, [userId]);

    const fetchIncomes = async () => {
        try {
            const response = await axios.get(`http://plasma-torus-454810-h1.lm.r.appspot.com/user_incomes/${userId}`);
            setIncomes(response.data.incomes);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`http://plasma-torus-454810-h1.lm.r.appspot.com/user_expenses/${userId}`);
            setExpenses(response.data.expenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleAddIncome = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://plasma-torus-454810-h1.lm.r.appspot.com/add_income', {
                user_id: userId,
                name: incomeName,
                amount: parseFloat(incomeAmount)
            });
            fetchIncomes();
            setShowIncomeModal(false);
            setIncomeName('');
            setIncomeAmount('');
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (parseFloat(expenseAmount) > remainingBalance) {
            setErrorMessage('Expense amount exceeds remaining balance.');
            return;
        }
        try {
            await axios.post('http://plasma-torus-454810-h1.lm.r.appspot.com/add_expense', {
                user_id: userId,
                expense: expenseName,
                category: expenseCategory,
                amount: parseFloat(expenseAmount)
            });
            fetchExpenses();
            setShowCreateExpenseModal(false);
            setExpenseName('');
            setExpenseCategory('');
            setExpenseAmount('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    const handleEditEntry = async (e) => {
        e.preventDefault();

        if (selectedEntry.type === 'Expense') {
            const originalAmount = parseFloat(expenses.find(expense => expense.budget_id === selectedEntry.id).amount);
            const newAmount = parseFloat(selectedEntry.amount);
            const newTotalExpenses = totalExpenses - originalAmount + newAmount;

            console.log("Debug: Original Amount:", originalAmount);
            console.log("Debug: New Amount:", newAmount);
            console.log("Debug: Total Expenses before update:", totalExpenses);
            console.log("Debug: Total Income:", totalIncome);
            console.log("Debug: New Total Expenses after update:", newTotalExpenses);

            if (newTotalExpenses > totalIncome) {
                setErrorMessage('Updating this expense would result in a negative balance.');
                console.log("Debug: Update blocked due to negative balance");
                return;
            }
        }

        if (selectedEntry.type === 'Income') {
            const originalAmount = parseFloat(incomes.find(income => income.income_id === selectedEntry.id).amount);
            const newAmount = parseFloat(selectedEntry.amount);
            const newTotalIncome = totalIncome - originalAmount + newAmount;

            console.log("Debug: Original Income Amount:", originalAmount);
            console.log("Debug: New Income Amount:", newAmount);
            console.log("Debug: Total Income before update:", totalIncome);
            console.log("Debug: Total Expenses:", totalExpenses);
            console.log("Debug: New Total Income after update:", newTotalIncome);

            if (newTotalIncome < totalExpenses) {
                setErrorMessage('Updating this income would result in insufficient funds to cover expenses.');
                console.log("Debug: Update blocked due to insufficient total income");
                return;
            }
        }

        try {
            const endpoint = selectedEntry.type === 'Income' ? `update_income/${selectedEntry.id}` : `update_expense/${selectedEntry.id}`;
            const response = await axios.put(`http://plasma-torus-454810-h1.lm.r.appspot.com/${endpoint}`, selectedEntry);
            if (response.status === 200) {
                alert(`${selectedEntry.type} updated successfully`);
                selectedEntry.type === 'Income' ? fetchIncomes() : fetchExpenses();
                setShowEditModal(false);
                if (selectedEntry.type === 'Income') {
                    setIncomes(incomes.map(income => income.income_id === selectedEntry.id ? { ...income, ...selectedEntry } : income));
                } else {
                    setExpenses(expenses.map(expense => expense.budget_id === selectedEntry.id ? { ...expense, ...selectedEntry } : expense));
                }
                setErrorMessage('');
            }
        } catch (error) {
            console.error(`Error updating ${selectedEntry.type.toLowerCase()}:`, error);
        }
    };

    const handleDeleteEntry = async () => {
        if (selectedEntry.type === 'Income') {
            const incomeToDelete = incomes.find(income => income.income_id === selectedEntry.id);
            const newTotalIncome = totalIncome - parseFloat(incomeToDelete.amount);
            
            if (newTotalIncome < totalExpenses) {
                setErrorMessage('Cannot delete income: resulting total income would not cover expenses.');
                setShowDeleteConfirmation(false);
                return;
            }
        }
        
        try {
            const endpoint = selectedEntry.type === 'Income' ? `delete_income/${selectedEntry.id}` : `delete_expense/${selectedEntry.id}`;
            const response = await axios.delete(`http://plasma-torus-454810-h1.lm.r.appspot.com/${endpoint}`);
            if (response.status === 200) {
                alert(`${selectedEntry.type} deleted successfully`);
                selectedEntry.type === 'Income' ? fetchIncomes() : fetchExpenses();
                setShowDeleteConfirmation(false);
                setShowEditModal(false);
            }
        } catch (error) {
            console.error(`Error deleting ${selectedEntry.type.toLowerCase()}:`, error);
        }
    };

    const openEditModal = (entry, type) => {
        setSelectedEntry({ ...entry, type, id: type === 'Income' ? entry.income_id : entry.budget_id });
        setErrorMessage(''); // Reset error message when opening modal
        setShowEditModal(true);
    };

    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const remainingBalance = totalIncome - totalExpenses;

    const expensePieData = {
        labels: expenses.map(expense => expense.category),
        datasets: [{
            data: expenses.map(expense => expense.amount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF4500'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF4500'],
            borderWidth: 1,
            borderColor: '#fff',
            hoverBorderColor: '#fff'
        }]
    };

    return (
        <div className="budget-container">
            <h1>Budgeting</h1>
            <h2>Total Income: £{totalIncome.toFixed(2)}</h2>
            <h2>Remaining Balance: £{remainingBalance.toFixed(2)}</h2>
            
            <div className="budget-columns">
                <div className="income-column">
                    <h3>Incomes</h3>
                    <button onClick={() => setShowIncomeModal(true)}>+ Add Income</button>
                    <ul>
                        {incomes.map(income => (
                            <li key={income.income_id}>
                                {income.name}: £{income.amount}
                                <button onClick={() => openEditModal(income, 'Income')}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="expense-column">
                    <h3>Expenses</h3>
                    <button onClick={() => setShowCreateExpenseModal(true)}>+ Add Expense</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>% of Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.budget_id}>
                                    <td>{expense.expense}</td>
                                    <td>{expense.category}</td>
                                    <td>£{expense.amount}</td>
                                    <td>{((expense.amount / totalIncome) * 100).toFixed(2)}%</td>
                                    <td>
                                        <button onClick={() => openEditModal(expense, 'Expense')}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ width: '50%', height: '400px', margin: '0 auto' }}>
                        <Pie data={expensePieData} />
                    </div>
                </div>
            </div>

            {showIncomeModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Income</h2>
                        <form onSubmit={handleAddIncome}>
                            <label>Income Name: <input type="text" value={incomeName} onChange={(e) => setIncomeName(e.target.value)} required /></label>
                            <label>Amount: <input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} required /></label>
                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setShowIncomeModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {showCreateExpenseModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Expense</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <form onSubmit={handleAddExpense}>
                            <label>Expense Name: <input type="text" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} required /></label>
                            <label>Category: <input type="text" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} required /></label>
                            <label>Amount: <input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required /></label>
                            <button type="submit">Add</button>
                            <button type="button" onClick={() => setShowCreateExpenseModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && selectedEntry && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit {selectedEntry.type}</h2>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <form onSubmit={handleEditEntry}>
                            <label>
                                Name:
                                <input type="text" value={selectedEntry.type === 'Income' ? selectedEntry.name : selectedEntry.expense} onChange={(e) => setSelectedEntry({ ...selectedEntry, name: e.target.value, expense: e.target.value })} required />
                            </label>
                            <br />
                            {selectedEntry.type === 'Expense' && (
                                <>
                                    <label>
                                        Category:
                                        <input type="text" value={selectedEntry.category} onChange={(e) => setSelectedEntry({ ...selectedEntry, category: e.target.value })} required />
                                    </label>
                                    <br />
                                </>
                            )}
                            <label>
                                Amount:
                                <input type="number" value={selectedEntry.amount} onChange={(e) => setSelectedEntry({ ...selectedEntry, amount: e.target.value })} required />
                            </label>
                            <br />
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setShowDeleteConfirmation(true)}>Delete {selectedEntry.type}</button>
                            <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Delete {selectedEntry.type}</h2>
                        <p>Are you sure you want to delete this {selectedEntry.type.toLowerCase()}?</p>
                        <button onClick={handleDeleteEntry}>Delete</button>
                        <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BudgetScreen;
