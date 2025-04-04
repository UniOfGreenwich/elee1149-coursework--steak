import pytest
from app import app, db, User, Account

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

def test_setup_form_creation(client):
    # Arrange
    client.post('/register', json={
        'username': 'setupuser',
        'password': 'setuppass',
        'email': 'setupuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    setup_data = {
        'userId': 1,
        'accountName': 'Savings Account',
        'accountType': 'savings',
        'balance': 1000.0, 
        'after_jar_total': 1000.0
    }

    # Act
    response = client.post('/setup', json=setup_data)

    # Assert
    assert response.status_code == 200
    assert b'Setup completed successfully.' in response.data

    # Verify the account was added to the database
    with app.app_context():
        account = Account.query.filter_by(user_id=1, account_name='Savings Account').first()
        assert account is not None
        assert account.balance == 1000.0
        assert account.after_jar_total == 1000.0

def test_update_new_status(client):
    # Arrange: Create a user
    client.post('/register', json={
        'username': 'statususer',
        'password': 'statuspass',
        'email': 'statususer@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })

    # Act: Update the new status
    response = client.post('/update_new_status/1', json={'new': True})

    # Assert
    assert response.status_code == 200
    assert b'User status updated.' in response.data

    # Verify the user's new status was updated in the database
    with app.app_context():
        user = User.query.get(1)
        assert user.new is True

def test_total_balance_display(client):
    # Arrange: Setup accounts for a user
    client.post('/register', json={
        'username': 'balanceuser',
        'password': 'balancepass',
        'email': 'balanceuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    client.post('/setup', json={
        'userId': 1,
        'accountName': 'Checking Account',
        'accountType': 'checking',
        'balance': 500.0,
        'after_jar_total':500.0
    })
    client.post('/setup', json={
        'userId': 1,
        'accountName': 'Savings Account',
        'accountType': 'savings',
        'balance': 1500.0,
        'after_jar_total': 1500.0
    })

    # Act
    response = client.get('/total_balance/1')

    # Assert
    assert response.status_code == 200
    data = response.get_json()
    assert data['total_balance'] == 2000.0
    assert len(data['accounts']) == 2
    assert data['available_total'] == 2000.0
