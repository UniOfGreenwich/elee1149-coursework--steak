import pytest
from app import app, db, User
from werkzeug.security import check_password_hash

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

def test_register_user(client):
    # Arrange
    new_user = {
        'username': 'testuser',
        'password': 'testpass',
        'email': 'testuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    }
    
    # Act
    response = client.post('/register', json=new_user)
    
    # Assert
    assert response.status_code == 201
    assert b'User registered successfully' in response.data
    
    # Verify the user was added to the database
    with app.app_context():
        user = User.query.filter_by(username='testuser').first()
        assert user is not None
        assert user.email == 'testuser@example.com'
        assert check_password_hash(user.password_hash, 'testpass')

def test_login_user(client):
    # Arrange: Register a user first
    client.post('/register', json={
        'username': 'loginuser',
        'password': 'loginpass',
        'email': 'loginuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    
    # Act
    response = client.post('/login', json={
        'username': 'loginuser',
        'password': 'loginpass'
    })
    
    # Assert
    assert response.status_code == 200
    assert b'Login successful' in response.data

def test_forgot_password(client):
    # Arrange: Register a user first
    client.post('/register', json={
        'username': 'forgotuser',
        'password': 'originalpass',
        'email': 'forgotuser@example.com',
        'security_1': 'answer1',
        'security_2': 'answer2',
        'security_3': 'answer3'
    })
    
    # Act: Attempt to reset the password
    response = client.post('/forgot-password', json={
        'username': 'forgotuser',
        'new_password': 'newpass',
        'confirm_password': 'newpass',
        'security_1_answer': 'answer1'
    })
    
    # Assert
    assert response.status_code == 200
    assert b'Password updated successfully' in response.data
    
    # Verify the password was updated by attempting to login with the new password
    login_response = client.post('/login', json={
        'username': 'forgotuser',
        'password': 'newpass'
    })
    assert login_response.status_code == 200
    assert b'Login successful' in login_response.data
