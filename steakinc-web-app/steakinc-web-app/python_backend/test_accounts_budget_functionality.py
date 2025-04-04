import pytest
from app import app, db, User, Account, Transaction, Income, Budget
from datetime import datetime
from decimal import Decimal

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_create_account(client):
    # Arrange: Register a user
    client.post('/register', json={
        'username': 'accountuser',
        'password': 'accountpass',
        'email': 'accountuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })

    # Act: Create an account
    account_data = {
        'user_id': 1,
        'account_name': 'Savings Account',
        'account_type': 'savings',
        'balance': '500.0'
    }
    response = client.post('/create_account', json=account_data)

    # Assert
    assert response.status_code == 201
    assert b'Account created successfully' in response.data

    # Verify the account was added to the database
    with app.app_context():
        account = Account.query.filter_by(account_name='Savings Account').first()
        assert account is not None
        assert account.balance == Decimal('500.0')

def test_update_account(client):
    # Arrange: Register a user and create an account
    client.post('/register', json={
        'username': 'accountuser',
        'password': 'accountpass',
        'email': 'accountuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/create_account', json={
        'user_id': 1,
        'account_name': 'Savings Account',
        'account_type': 'savings',
        'balance': '500.0'
    })

    # Act: Update the account
    update_data = {
        'account_name': 'Emergency Fund',
        'account_type': 'checking'
    }
    response = client.put('/update_account/1', json=update_data)

    # Assert
    assert response.status_code == 200
    assert b'Account updated successfully' in response.data

    # Verify the account was updated in the database
    with app.app_context():
        account = Account.query.get(1)
        assert account.account_name == 'Emergency Fund'
        assert account.account_type == 'checking'

def test_delete_account(client):
    # Arrange: Register a user and create an account
    client.post('/register', json={
        'username': 'accountuser',
        'password': 'accountpass',
        'email': 'accountuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/create_account', json={
        'user_id': 1,
        'account_name': 'Savings Account',
        'account_type': 'savings',
        'balance': '500.0'
    })

    # Act: Delete the account
    response = client.delete('/delete_account/1')

    # Assert
    assert response.status_code == 200
    assert b'Account and related jars deleted successfully' in response.data

    # Verify the account was soft deleted in the database
    with app.app_context():
        account = Account.query.get(1)
        assert account.is_deleted is True

def test_add_income(client):
    # Arrange: Register a user
    client.post('/register', json={
        'username': 'budgetuser',
        'password': 'budgetpass',
        'email': 'budgetuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })

    # Act: Add an income
    income_data = {
        'user_id': 1,
        'name': 'Salary',
        'amount': '3000.0'
    }
    response = client.post('/add_income', json=income_data)

    # Assert
    assert response.status_code == 201
    assert b'Income added successfully' in response.data

    # Verify the income was added to the database
    with app.app_context():
        income = Income.query.filter_by(name='Salary').first()
        assert income is not None
        assert income.amount == Decimal('3000.0')

def test_add_expense(client):
    # Arrange: Register a user
    client.post('/register', json={
        'username': 'budgetuser',
        'password': 'budgetpass',
        'email': 'budgetuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })

    # Act: Add an expense
    expense_data = {
        'user_id': 1,
        'expense': 'Rent',
        'category': 'Housing',
        'amount': '1200.0'
    }
    response = client.post('/add_expense', json=expense_data)

    # Assert
    assert response.status_code == 201
    assert b'Expense added successfully' in response.data

    # Verify the expense was added to the database
    with app.app_context():
        expense = Budget.query.filter_by(expense='Rent').first()
        assert expense is not None
        assert expense.amount == Decimal('1200.0')

def test_delete_income(client):
    # Arrange: Register a user and add an income
    client.post('/register', json={
        'username': 'budgetuser',
        'password': 'budgetpass',
        'email': 'budgetuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/add_income', json={
        'user_id': 1,
        'name': 'Salary',
        'amount': '3000.0'
    })

    # Act: Delete the income
    response = client.delete('/delete_income/1')

    # Assert
    assert response.status_code == 200
    assert b'Income deleted successfully' in response.data

    # Verify the income was soft deleted in the database
    with app.app_context():
        income = Income.query.get(1)
        assert income.is_deleted is True

def test_delete_expense(client):
    # Arrange: Register a user and add an expense
    client.post('/register', json={
        'username': 'budgetuser',
        'password': 'budgetpass',
        'email': 'budgetuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/add_expense', json={
        'user_id': 1,
        'expense': 'Rent',
        'category': 'Housing',
        'amount': '1200.0'
    })

    # Act: Delete the expense
    response = client.delete('/delete_expense/1')

    # Assert
    assert response.status_code == 200
    assert b'Expense deleted successfully' in response.data

    # Verify the expense was soft deleted in the database
    with app.app_context():
        expense = Budget.query.get(1)
        assert expense.is_deleted is True

def test_update_income(client):
    # Arrange: Register a user and add an income
    client.post('/register', json={
        'username': 'budgetuser',
        'password': 'budgetpass',
        'email': 'budgetuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/add_income', json={
        'user_id': 1,
        'name': 'Salary',
        'amount': '3000.0'
    })

    # Act: Update the income
    update_data = {
        'name': 'Bonus',
        'amount': '5000.0'
    }
    response = client.put('/update_income/1', json=update_data)

    # Assert
    assert response.status_code == 200
    assert b'Income updated successfully' in response.data

    # Verify the income was updated in the database
    with app.app_context():
        income = Income.query.get(1)
        assert income.name == 'Bonus'
        assert income.amount == Decimal('5000.0')

def test_update_expense(client):
    # Arrange: Register a user and add an expense
    client.post('/register', json={
        'username': 'budgetuser',
        'password': 'budgetpass',
        'email': 'budgetuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/add_expense', json={
        'user_id': 1,
        'expense': 'Rent',
        'category': 'Housing',
        'amount': '1200.0'
    })

    # Act: Update the expense
    update_data = {
        'expense': 'Mortgage',
        'category': 'Housing',
        'amount': '1500.0'
    }
    response = client.put('/update_expense/1', json=update_data)

    # Assert
    assert response.status_code == 200
    assert b'Expense updated successfully' in response.data

    # Verify the expense was updated in the database
    with app.app_context():
        expense = Budget.query.get(1)
        assert expense.expense == 'Mortgage'
        assert expense.amount == Decimal('1500.0')