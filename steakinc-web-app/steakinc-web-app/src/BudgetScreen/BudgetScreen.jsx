import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import NavSideBar from '../JarsScreen/NavSideBar'; // Import the NavSideBar component
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
    const [categories, setCategories] = useState(['Rent', 'Utilities', 'Groceries', 'Entertainment', 'Transportation']);
    const location = useLocation();
    const userId = location.state?.userId;
    useEffect(() => {
        fetchIncomes();
        fetchExpenses();
    }, [userId]);
    const fetchIncomes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/user_incomes/${userId}`);
            setIncomes(response.data.incomes);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };
    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/user_expenses/${userId}`);
            setExpenses(response.data.expenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };
    const handleAddIncome = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/add_income', {
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
            await axios.post('http://localhost:5000/add_expense', {
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
            const response = await axios.put(`http://localhost:5000/${endpoint}`, selectedEntry);
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
            const response = await axios.delete(`http://localhost:5000/${endpoint}`);
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

    // Function to group expenses by category
    const groupExpensesByCategory = () => {
        const grouped = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += parseFloat(expense.amount);
            return acc;
        }, {});
        return Object.entries(grouped).map(([category, total]) => ({ category, total }));
    };

    // Prepare data for the pie chart
    const groupedExpenses = groupExpensesByCategory();
    const expensePieData = {
        labels: groupedExpenses.map(item => item.category),
        datasets: [{
            data: groupedExpenses.map(item => item.total),
            backgroundColor: ['#DA4259', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF4500'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF4500'],
            borderWidth: 1,
            borderColor: '#fff',
            hoverBorderColor: '#fff'
        }]
    };

    return (
        <div>
            <NavSideBar />
            <div className="budget-main-container">
                <div className="budget-header">
                    <div className="income-container">
                        <h2>Monthly Income</h2>
                        <h2>£{totalIncome.toFixed(2)}</h2>
                    </div>
                    <div className="budet-pie-chart">
                        <Pie data={expensePieData} />
                    </div>
                    <div className="balance-container">
                        <h2>Leftover Amount</h2>
                        <h2>£{remainingBalance.toFixed(2)}</h2>
                    </div>
                </div>
                <div className="budget-tables">
                    <div className="income-table">
                        <button className="add-income-button" onClick={() => setShowIncomeModal(true)}>+ Add Income</button>
                        <ul>
                            {incomes.map(income => (
                                <li key={income.income_id}>
                                    {income.name}: £{income.amount}
                                    <button className='budget-edit-button' onClick={() => openEditModal(income, 'Income')}>Edit</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                   
                    <div className="expense-table">
                        <button className="add-expense-button" onClick={() => setShowCreateExpenseModal(true)}>+ Add Expense</button>
                        <table>
                            <thead>
                                <tr>
                                    <th className='expense-table-header'>Name</th>
                                    <th className='expense-table-header'>Category</th>
                                    <th className='expense-table-header'>Amount</th>
                                    <th className='expense-table-header'>% of Total</th>
                                    <th className='expense-table-header'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => (
                                    <tr key={expense.budget_id}>
                                        <td className='expense-table-item'>{expense.expense}</td>
                                        <td className='expense-table-item'>{expense.category}</td>
                                        <td className='expense-table-item'>£{expense.amount}</td>
                                        <td className='expense-table-item'>{((expense.amount / totalIncome) * 100).toFixed(2)}%</td>
                                        <td>
                                            <button className='budget-edit-button' onClick={() => openEditModal(expense, 'Expense')}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {showIncomeModal && (
                    <div className="add-income-overlay">
                        <div className="add-income-content">
                            <h2>Add Income</h2>
                            <form className='add-income-form' onSubmit={handleAddIncome}>
                                <div className="add-income-form-item">
                                    <label>Income Name: </label>
                                    <input className='input-field' type="text" value={incomeName} onChange={(e) => setIncomeName(e.target.value)} required />
                                </div>
                                <div className="add-income-form-item">
                                    <label>Amount: </label>
                                    <input className='input-field' type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} required />
                                </div>
                                <div className="budget-button-container">
                                    <button className='budget-submit-button' type="submit">Add</button>
                                    <button className='budget-cancel-button' type="button" onClick={() => setShowIncomeModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showCreateExpenseModal && (
                    <div className="add-expense-overlay">
                        <div className="add-expense-content">
                            <h2>Add Expense</h2>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <form className='add-expense-form' onSubmit={handleAddExpense}>
                                <div className="add-expense-item">
                                    <input className='input-field' type="text" placeholder='Expense Name:' value={expenseName} onChange={(e) => setExpenseName(e.target.value)} required />
                                </div>
                                <div className="add-expense-item">
                                    <label>
                                        <select className='input-field' value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} required>
                                            <option value="" disabled>Select category</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div className="add-expense-item">
                                    <input className='input-field' placeholder='Amount:' type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required />
                                </div>
                                <div className="budget-button-container">
                                    <button className='budget-submit-button' type="submit">Add</button>
                                    <button className='budget-cancel-button' type="button" onClick={() => setShowCreateExpenseModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showEditModal && selectedEntry && (
                    <div className="budget-edit-overlay">
                        <div className="budget-edit-content">
                            <h2>Edit {selectedEntry.type}</h2>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <form className='budget-edit-form' onSubmit={handleEditEntry}>
                                <label>
                                    <input className='input-field' type="text" value={selectedEntry.type === 'Income' ? selectedEntry.name : selectedEntry.expense} onChange={(e) => setSelectedEntry({ ...selectedEntry, name: e.target.value, expense: e.target.value })} required />
                                </label>
                                <br />
                                {selectedEntry.type === 'Expense' && (
                                    <>
                                        <label>
                                            Category:
                                            <select className='input-field' value={selectedEntry.category} onChange={(e) => setSelectedEntry({ ...selectedEntry, category: e.target.value })} required>
                                                <option value="" disabled>Select category</option>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <br />
                                    </>
                                )}
                                <label>
                                    <input className='input-field' type="number" value={selectedEntry.amount} onChange={(e) => setSelectedEntry({ ...selectedEntry, amount: e.target.value })} required />
                                </label>
                                <br />
                                <div className="budget-button-container">
                                    <button className='budget-cancel-button' type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button className='budget-submit-button' type="submit">Save</button>
                                    <button className='budget-cancel-button' type="button" onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
                                </div>
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
        </div>
    );
}
export default BudgetScreen;