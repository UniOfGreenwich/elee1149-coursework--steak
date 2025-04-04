import pytest
from app import app, db, User, Account, Jar, Transaction
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

def test_create_transaction(client):
    # Arrange: Register a user, create an account, and a jar
    client.post('/register', json={
        'username': 'transactionuser',
        'password': 'transactionpass',
        'email': 'transactionuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/setup', json={
        'userId': 1,
        'accountName': 'Main Account',
        'accountType': 'checking',
        'balance': 1000.0
    })
    client.post('/create_jar', json={
        'user_id': 1,
        'account_id': 1,
        'jar_name': 'Savings Jar',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    })

    # Act: Create a transaction
    transaction_data = {
        'account_id': 1,
        'user_id': 1,
        'jar_id': None,  # No jar involved in this transaction
        'amount': '100.0',
        'transaction_type': 'ingoing',
        'category': 'Salary',
        'description': 'Monthly salary'
    }
    response = client.post('/create_transaction', json=transaction_data)

    # Assert
    assert response.status_code == 201
    assert b'Transaction created successfully' in response.data

    # Verify the transaction was added to the database
    with app.app_context():
        transaction = Transaction.query.filter_by(description='Monthly salary').first()
        assert transaction is not None
        assert transaction.amount == Decimal('100.0')

def test_get_user_transactions(client):
    # Arrange: Register a user, create an account, a jar, and a transaction
    client.post('/register', json={
        'username': 'transactionuser',
        'password': 'transactionpass',
        'email': 'transactionuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/setup', json={
        'userId': 1,
        'accountName': 'Main Account',
        'accountType': 'checking',
        'balance': 1000.0
    })
    client.post('/create_jar', json={
        'user_id': 1,
        'account_id': 1,
        'jar_name': 'Savings Jar',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    })
    client.post('/create_transaction', json={
        'account_id': 1,
        'user_id': 1,
        'jar_id': None,
        'amount': '100.0',
        'transaction_type': 'ingoing',
        'category': 'Salary',
        'description': 'Monthly salary'
    })

    # Act: Get user transactions
    response = client.get('/user_transactions/1')

    # Assert
    assert response.status_code == 200
    data = response.get_json()
    
    # Check that there are two transactions
    assert len(data['transactions']) == 2
    
    # Verify the details of the transactions
    initial_transaction = next(t for t in data['transactions'] if t['description'] == 'Initial balance on account creation')
    salary_transaction = next(t for t in data['transactions'] if t['description'] == 'Monthly salary')

    assert initial_transaction['amount'] == 1000.0
    assert initial_transaction['category'] == 'account'
    assert initial_transaction['post_account_total'] == 1000.0

    assert salary_transaction['amount'] == 100.0
    assert salary_transaction['category'] == 'Salary'
    assert salary_transaction['post_account_total'] == 1100.0

def test_get_user_jar_transactions(client):
    # Arrange: Register a user, create an account, a jar, and a transaction
    client.post('/register', json={
        'username': 'transactionuser',
        'password': 'transactionpass',
        'email': 'transactionuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/setup', json={
        'userId': 1,
        'accountName': 'Main Account',
        'accountType': 'checking',
        'balance': 1000.0
    })
    client.post('/create_jar', json={
        'user_id': 1,
        'account_id': 1,
        'jar_name': 'Savings Jar',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    })
    client.post('/create_transaction', json={
        'account_id': 1,
        'user_id': 1,
        'jar_id': 1,
        'amount': '50.0',
        'transaction_type': 'ingoing',
        'category': 'Bonus',
        'description': 'Year-end bonus'
    })

    # Act: Get user jar transactions
    response = client.get('/user_jar_transactions/1/1')

    # Assert
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['transactions']) == 1
    assert data['transactions'][0]['description'] == 'Year-end bonus'
