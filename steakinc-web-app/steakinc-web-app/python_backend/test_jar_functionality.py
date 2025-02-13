import pytest
from app import app, db, User, Account, Jar
from datetime import datetime

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

def test_create_jar(client):
    # Arrange: Register a user and create an account
    client.post('/register', json={
        'username': 'jaruser',
        'password': 'jarpass',
        'email': 'jaruser@example.com',
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

    # Act: Create a jar
    jar_data = {
        'user_id': 1,
        'account_id': 1,
        'jar_name': 'Vacation Fund',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    }
    response = client.post('/create_jar', json=jar_data)

    # Assert
    assert response.status_code == 201
    assert b'Jar created successfully' in response.data

    # Verify the jar was added to the database
    with app.app_context():
        jar = Jar.query.filter_by(jar_name='Vacation Fund').first()
        assert jar is not None
        assert jar.allocated_amount == 200.0

def test_get_user_jars(client):
    # Arrange: Register a user, create an account, and a jar
    client.post('/register', json={
        'username': 'jaruser',
        'password': 'jarpass',
        'email': 'jaruser@example.com',
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
        'jar_name': 'Vacation Fund',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    })

    # Act: Get user's jars
    response = client.get('/user_jars/1')

    # Assert
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['jars']) == 1
    assert data['jars'][0]['jar_name'] == 'Vacation Fund'

def test_update_jar(client):
    # Arrange: Register a user, create an account, and a jar
    client.post('/register', json={
        'username': 'jaruser',
        'password': 'jarpass',
        'email': 'jaruser@example.com',
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
        'jar_name': 'Vacation Fund',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    })

    # Act: Update the jar
    update_data = {
        'jar_name': 'Holiday Fund',
        'target_amount': 600.0
    }
    response = client.put('/update_jar/1', json=update_data)

    # Assert
    assert response.status_code == 200
    assert b'Jar updated successfully' in response.data

    # Verify the jar was updated in the database
    with app.app_context():
        jar = Jar.query.get(1)
        assert jar.jar_name == 'Holiday Fund'
        assert jar.target_amount == 600.0

def test_delete_jar(client):
    # Arrange: Register a user, create an account, and a jar
    client.post('/register', json={
        'username': 'jaruser',
        'password': 'jarpass',
        'email': 'jaruser@example.com',
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
        'jar_name': 'Vacation Fund',
        'allocated_amount': 200.0,
        'target_amount': 500.0
    })

    # Act: Delete the jar
    response = client.delete('/delete_jar/1')

    # Assert
    assert response.status_code == 200
    assert b'Jar deleted successfully' in response.data

    # Verify the jar was soft deleted in the database
    with app.app_context():
        jar = Jar.query.get(1)
        assert jar.is_deleted is True
