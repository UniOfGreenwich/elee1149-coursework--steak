from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///steak_finance_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the User model
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)
    new = db.Column(db.Boolean, default=True)
    security_1 = db.Column(db.String(100), nullable=True)
    security_2 = db.Column(db.String(100), nullable=True)
    security_3 = db.Column(db.String(100), nullable=True)

# Define the Account model
class Account(db.Model):
    account_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    account_name = db.Column(db.String(50), nullable=False)
    account_type = db.Column(db.String(20), nullable=False)
    balance = db.Column(db.Numeric(15, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)

# Define the Transaction model
class Transaction(db.Model):
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    jar_id = db.Column(db.Integer, db.ForeignKey('jar.jar_id'), nullable=True)
    transaction_date = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)
    category = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

# Define the Jar model
class Jar(db.Model):
    jar_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=False)
    jar_name = db.Column(db.String(50), nullable=False)
    allocated_amount = db.Column(db.Numeric(15, 2), nullable=False)
    current_balance = db.Column(db.Numeric(15, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)

# Define the Income model
class Income(db.Model):
    income_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    income_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

# Define the Budget model
class Budget(db.Model):
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, onupdate=datetime.utcnow)

# Function to create tables
def create_tables():
    with app.app_context():
        db.create_all()

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    security_1 = data.get('security_1')
    security_2 = data.get('security_2')
    security_3 = data.get('security_3')

    if not username or not password or not email:
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409

    # Hash the password and security answers
    password_hash = generate_password_hash(password)
    security_1_hash = generate_password_hash(security_1)
    security_2_hash = generate_password_hash(security_2)
    security_3_hash = generate_password_hash(security_3)

    # Create a new user object
    new_user = User(
        username=username,
        password_hash=password_hash,
        email=email,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        security_1=security_1_hash,
        security_2=security_2_hash,
        security_3=security_3_hash
    )

    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    # Find the user by username
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        # Authentication successful
        return jsonify({'message': 'Login successful', 'user_id': user.user_id, 'is_new': user.new}), 200
    else:
        # Authentication failed
        return jsonify({'error': 'Invalid username or password'}), 401

# Forgot password endpoint 
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    username = data.get('username')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    security_1_answer = data.get('security_1_answer')

    if not username or not new_password or not confirm_password or not security_1_answer:
        return jsonify({'error': 'Missing required fields'}), 400

    if new_password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    # Find the user by username
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Verify security question answer
    if not check_password_hash(user.security_1, security_1_answer):
        return jsonify({'error': 'Incorrect security answer'}), 401

    # Update the user's password
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200


    
# Setup endpoint
@app.route('/setup', methods=['POST'])
def setup():
    data = request.json
    logging.debug(f"Received data: {data}")
    user_id = data.get('userId')
    logging.debug(f"User ID received: {user_id}")
 
    if user_id is None:
        return jsonify({'error': 'User ID is required'}), 400
 
    account_name = data.get('accountName')
    account_type = data.get('accountType')
    balance = data.get('balance')
    monthly_income = data.get('monthlyIncome')
 
    try:
        # Save account details
        new_account = Account(user_id=user_id, account_name=account_name, account_type=account_type, balance=balance)
        db.session.add(new_account)
        db.session.commit()  # Commit to get account_id
 
        # Save income details using the new account_id
        new_income = Income(user_id=user_id, account_id=new_account.account_id, amount=monthly_income, income_date=datetime.utcnow())
        db.session.add(new_income)
 
        db.session.commit()
        return jsonify({'message': 'Setup completed successfully.'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        logging.error(f"Error during setup: {e}")
        return jsonify({'error': 'An error occurred during setup'}), 500
 
 
# Update 'new' status endpoint
@app.route('/update_new_status/<int:user_id>', methods=['POST'])
def update_new_status(user_id):
    user = User.query.get(user_id)
    if user:
        user.new = request.json.get('new', False)
        db.session.commit()
        return jsonify({'message': 'User status updated.'}), 200
    return jsonify({'error': 'User not found.'}), 404


if __name__ == '__main__':
    create_tables()  # Ensure tables are created when the app starts
    app.run(debug=True)




