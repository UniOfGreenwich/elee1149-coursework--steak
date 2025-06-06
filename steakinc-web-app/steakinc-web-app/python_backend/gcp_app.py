from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import logging
from decimal import Decimal
import csv
from io import StringIO
import os

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Configure the database URI using environment variables for security
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{os.getenv('DB_USERNAME', 'postgres')}:"
    f"{os.getenv('DB_PASSWORD', 'steak')}@"
    f"{os.getenv('DB_HOST', '35.189.80.101')}/"
    f"{os.getenv('DB_NAME', 'steak_prod')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the User model
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, nullable=False, onupdate=datetime.utcnow)
    new = db.Column(db.Boolean, default=True)
    security_1 = db.Column(db.String(256), nullable=True)
    security_2 = db.Column(db.String(256), nullable=True)
    security_3 = db.Column(db.String(256), nullable=True)

# Define the Account model
class Account(db.Model):
    account_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    account_name = db.Column(db.String(50), nullable=False)
    account_type = db.Column(db.String(20), nullable=False)
    balance = db.Column(db.Numeric(15, 2), nullable=False)
    after_jar_total = db.Column(db.Numeric(15, 2), nullable=False, default=0.0)  # Tracks balance after jar allocations
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, nullable=False, onupdate=datetime.now)
    is_deleted = db.Column(db.Boolean, default=False)

# Define the Transaction model
class Transaction(db.Model):
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    jar_id = db.Column(db.Integer, db.ForeignKey('jar.jar_id'), nullable=True)
    transaction_date = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)
    pre_account_total = db.Column(db.Numeric(15, 2), nullable=False)
    post_account_total = db.Column(db.Numeric(15, 2), nullable=False)
    category = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    source_account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=True)
    destination_account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=True)
    source_jar_id = db.Column(db.Integer, db.ForeignKey('jar.jar_id'), nullable=True)
    destination_jar_id = db.Column(db.Integer, db.ForeignKey('jar.jar_id'), nullable=True)

# Define the Jar model
class Jar(db.Model):
    jar_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.account_id'), nullable=False)
    jar_name = db.Column(db.String(50), nullable=False)
    allocated_amount = db.Column(db.Numeric(15, 2), nullable=False)
    current_balance = db.Column(db.Numeric(15, 2), nullable=False)
    target_amount = db.Column(db.Numeric(15, 2), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, nullable=False, onupdate=datetime.now)
    is_deleted = db.Column(db.Boolean, default=False)

# Define the Income model
class Income(db.Model):
    income_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    income_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)

# Define the Budget model
class Budget(db.Model):
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    expense = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, nullable=False, onupdate=datetime.now)
    is_deleted = db.Column(db.Boolean, default=False)

# Function to create tables in the database
def create_tables():
    with app.app_context():
        db.create_all()

# Home route for testing the server
@app.route('/')
def home():
    return 'Hello, World!'

# Registration endpoint for new users
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    security_1 = data.get('security_1')
    security_2 = data.get('security_2')
    security_3 = data.get('security_3')

    # Validate required fields
    if not username or not password or not email:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the username already exists
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

# Login endpoint for user authentication
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Validate required fields
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    # Find the user by username
    user = User.query.filter_by(username=username).first()

    # Check if the password matches
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful', 'user_id': user.user_id, 'is_new': user.new}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Forgot password endpoint
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    username = data.get('username')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    security_answer = data.get('security_answer')
    security_question = data.get('security_question')

    # Validate required fields
    if not username or not new_password or not confirm_password or not security_answer or not security_question:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the passwords match
    if new_password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    # Find the user by username
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Verify the security question answer
    if security_question == "Favorite book or movie?" and not check_password_hash(user.security_1, security_answer):
        return jsonify({'error': 'Incorrect security answer'}), 401
    elif security_question == "Name of birthplace?" and not check_password_hash(user.security_2, security_answer):
        return jsonify({'error': 'Incorrect security answer'}), 401
    elif security_question == "Mother's maiden name?" and not check_password_hash(user.security_3, security_answer):
        return jsonify({'error': 'Incorrect security answer'}), 401

    # Update the user's password
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200

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
    balance = Decimal(data.get('balance'))

    try:
        # Fetch all existing accounts for the user to calculate pre_account_total
        accounts = Account.query.filter_by(user_id=user_id).all()
        pre_account_total = sum(account.balance for account in accounts)

        # Create the new account
        new_account = Account(
            user_id=user_id,
            account_name=account_name,
            account_type=account_type,
            balance=balance,
            after_jar_total=balance
        )
        db.session.add(new_account)
        db.session.commit()  # Commit to get account_id

        # Calculate the post_account_total (including the new account)
        post_account_total = pre_account_total + balance

        # Record the transaction for account creation
        transaction = Transaction(
            account_id=new_account.account_id,
            user_id=user_id,
            transaction_date=datetime.now(),
            amount=balance,
            transaction_type='ingoing',
            pre_account_total=pre_account_total,
            post_account_total=post_account_total,
            category='account',
            description='Initial balance on account creation'
        )
        db.session.add(transaction)

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


@app.route('/total_balance/<int:user_id>', methods=['GET'])
def total_balance(user_id):
    try:
        accounts = Account.query.filter_by(user_id=user_id, is_deleted=False).all()
        account_details = [{'account_id': account.account_id, 'name': account.account_name, 'balance': float(account.balance), 'available_funds': float(account.after_jar_total), 'account_type': account.account_type} for account in accounts]
        total_balance = sum(account['balance'] for account in account_details)
        available_total = sum(account['available_funds'] for account in account_details)

        return jsonify({
            'total_balance': total_balance,
            'accounts': account_details,
            'available_total': available_total
        }), 200
    except Exception as e:
        logging.error(f"Error calculating total balance: {e}")
        return jsonify({'error': 'An error occurred while calculating total balance'}), 500


@app.route('/create_jar', methods=['POST'])
def create_jar():
    data = request.json
    user_id = data.get('user_id')
    account_id = data.get('account_id')
    jar_name = data.get('jar_name')
    allocated_amount = data.get('allocated_amount')
    target_amount = data.get('target_amount')

    if not user_id or not account_id or not jar_name or not allocated_amount:
        return jsonify({'error': 'Missing required fields'}), 400

    # Fetch the account from the database
    account = Account.query.filter_by(account_id=account_id, user_id=user_id, is_deleted=False).first()
    print(f"Received account_id: {account_id}, user_id: {user_id}")
    
    if not account:
        return jsonify({'error': 'Account not found'}), 404
    
    # Check if the allocated amount is less than or equal to the after_jar_total
    if float(allocated_amount) > float(account.after_jar_total):
        return jsonify({'error': 'Allocated amount exceeds available balance after accounting for jars'}), 400

    # Create a new jar object
    new_jar = Jar(
        user_id=user_id,
        account_id=account_id,
        jar_name=jar_name,
        allocated_amount=allocated_amount,
        current_balance=allocated_amount,  # Assuming the jar starts with the allocated amount
        target_amount=target_amount,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    # Add the jar to the database
    db.session.add(new_jar)
    db.session.commit()

    # Update the after_jar_total for the account
    total_jar_balance = db.session.query(db.func.sum(Jar.current_balance)).filter_by(account_id=account_id, is_deleted=False).scalar() or 0.0
    account.after_jar_total = account.balance - total_jar_balance
    db.session.commit()

    return jsonify({'message': 'Jar created successfully', 'jar_id': new_jar.jar_id}), 201

@app.route('/user_jars/<int:user_id>', methods=['GET'])
def get_user_jars(user_id):
    # Fetch all jars for a specific user that are not marked as deleted
    try:
        jars = Jar.query.filter_by(user_id=user_id, is_deleted=False).all()
        # Convert jar objects into a list of dictionaries for JSON response
        jar_details = [{
            'jar_id': jar.jar_id,
            'jar_name': jar.jar_name,
            'allocated_amount': float(jar.allocated_amount),
            'current_balance': float(jar.current_balance),
            'target_amount': float(jar.target_amount or 0),
            'account_id': jar.account_id
        } for jar in jars]
        return jsonify({'jars': jar_details}), 200
    except Exception as e:
        # Log the error and return a generic error message
        logging.error(f"Error fetching jars: {e}")
        return jsonify({'error': 'An error occurred while fetching jars'}), 500

@app.route('/update_jar/<int:jar_id>', methods=['PUT'])
def update_jar(jar_id):
    # Update the details of a specific jar
    data = request.json
    jar_name = data.get('jar_name')
    target_amount = data.get('target_amount')

    # Fetch the jar by its ID
    jar = Jar.query.get(jar_id)
    if not jar:
        return jsonify({'error': 'Jar not found'}), 404

    # Update the jar's name and target amount if provided
    if jar_name:
        jar.jar_name = jar_name
    if target_amount is not None:
        jar.target_amount = target_amount
    if target_amount == '':
        jar.target_amount = None

    # Commit the changes to the database
    db.session.commit()
    return jsonify({'message': 'Jar updated successfully'}), 200

@app.route('/delete_jar/<int:jar_id>', methods=['DELETE'])
def delete_jar(jar_id):
    jar = Jar.query.get(jar_id)
    if not jar:
        return jsonify({'error': 'Jar not found'}), 404

    # Update the account's after_jar_total
    account = Account.query.get(jar.account_id)
    account.after_jar_total += jar.current_balance

    # Soft delete the jar
    jar.is_deleted = True
    db.session.commit()

    return jsonify({'message': 'Jar deleted successfully'}), 200


@app.route('/create_transaction', methods=['POST'])
def create_transaction():
    data = request.json
    account_id = data.get('account_id')
    jar_id = data.get('jar_id')
    amount = Decimal(data.get('amount'))  # Convert amount to Decimal
    transaction_type = data.get('transaction_type')
    user_id = data.get('user_id')
    category = data.get('category')
    description = data.get('description')
    source_account_id = data.get('source_account_id')
    destination_account_id = data.get('destination_account_id')
    source_jar_id = data.get('source_jar_id')
    destination_jar_id = data.get('destination_jar_id')
    overflow = False

    # Convert empty strings to None
    if source_account_id == '':
        source_account_id = None
    if destination_account_id == '':
        destination_account_id = None
    
    # Use the session to get the account
    session: Session = db.session
    account = session.get(Account, account_id)

    # Check if the transaction is outgoing and there are sufficient funds
    if transaction_type == 'outgoing' and not jar_id:
        if account.after_jar_total < amount:
            return jsonify({'error': 'Insufficient funds in account'}), 400
            overflow = True
    elif transaction_type == 'outgoing' and jar_id:
            jar = Jar.query.get(jar_id)
            if jar.current_balance < amount:
                return jsonify({'error': 'Insufficient funds in jar'}), 400
                overflow = True

    # Calculate pre_account_total (sum of all account balances)
    accounts = Account.query.filter_by(user_id=user_id, is_deleted=False).all()
    pre_account_total = sum(account.balance for account in accounts)

    # Apply the transaction
    if transaction_type == 'ingoing':
        if jar_id:
            jar = Jar.query.get(jar_id)
            jar.current_balance += amount
            account.balance += amount
        else:
            account.balance += amount

    elif transaction_type == 'outgoing' and overflow == False:
        account.balance -= amount
        if jar_id:
            jar = Jar.query.get(jar_id)
            jar.current_balance -= amount
    elif transaction_type == 'transfer':
        source_account = Account.query.get(source_account_id)
        destination_account = Account.query.get(destination_account_id)
        source_jar = Jar.query.get(source_jar_id) if source_jar_id else None
        destination_jar = Jar.query.get(destination_jar_id) if destination_jar_id else None

        if source_jar and destination_jar:
            # Jar to Jar transfer
            if source_jar.current_balance < amount:
                return jsonify({'error': 'Insufficient funds in source jar'}), 400
            source_jar.current_balance -= amount
            if source_jar.account_id == destination_jar.account_id:
                destination_jar.current_balance += amount
            else:
                source_account.balance -= amount
                destination_account.balance += amount
                destination_jar.current_balance += amount
        elif source_jar and not destination_jar:
            # Jar to Account transfer
            if source_jar.current_balance < amount:
                return jsonify({'error': 'Insufficient funds in source jar'}), 400
            source_jar.current_balance -= amount
            source_account.balance -= amount
            destination_account.balance += amount
            destination_account.after_jar_total += amount
        elif not source_jar and destination_jar:
            # Account to Jar transfer
            if source_account.balance < amount:
                return jsonify({'error': 'Insufficient funds in source account'}), 400
            source_account.balance -= amount
            source_account.after_jar_total -= amount
            destination_account.balance += amount
            destination_jar.current_balance += amount
        else:
            # Account to Account transfer
            if source_account.balance < amount:
                return jsonify({'error': 'Insufficient funds in source account'}), 400
            source_account.balance -= amount
            source_account.after_jar_total -= amount
            destination_account.balance += amount
            destination_account.after_jar_total += amount

    # Commit changes to account and jar to ensure balances are updated
    db.session.commit()

    # Calculate post_account_total (sum of all account balances after transaction)
    post_account_total = sum(account.balance for account in accounts)

    # Update after_jar_total if no jar is specified
    if not jar_id:
        total_jar_balance = db.session.query(db.func.sum(Jar.current_balance)).filter_by(account_id=account_id).scalar() or Decimal('0.0')
        account.after_jar_total = account.balance - Decimal(total_jar_balance)

    # Create and save the transaction
    transaction = Transaction(
        account_id=account_id,
        user_id=user_id,
        jar_id=jar_id,
        transaction_date=datetime.now(),
        amount=amount,
        transaction_type=transaction_type,
        pre_account_total=pre_account_total,
        post_account_total=post_account_total if not jar_id else pre_account_total,  # Do not change post_account_total if incoming to a jar
        category=category,
        description=description,
        source_account_id=source_account_id,
        destination_account_id=destination_account_id,
        source_jar_id=source_jar_id,
        destination_jar_id=destination_jar_id
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction created successfully'}), 201

@app.route('/user_transactions/<int:user_id>', methods=['GET'])
def get_user_transactions(user_id):
    try:
        # Query to get all transactions for the user ordered by date
        transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.transaction_date.desc()).all()
        
        # Convert transaction objects to dictionaries
        transaction_list = [{
            'transaction_id': transaction.transaction_id,
            'transaction_date': transaction.transaction_date.strftime("%Y-%m-%d %H:%M:%S.%f"),
            'amount': float(transaction.amount),
            'type': transaction.transaction_type,
            'category': transaction.category,
            'description': transaction.description,
            'pre_account_total': float(transaction.pre_account_total),
            'post_account_total': float(transaction.post_account_total)
        } for transaction in transactions]

        return jsonify({'transactions': transaction_list}), 200

    except Exception as e:
        # Log the error and return a generic error message
        print(f"Error fetching transactions for user {user_id}: {e}")
        return jsonify({'error': 'An error occurred while fetching transactions'}), 500
    
@app.route('/user_jar_transactions/<int:user_id>/<int:jar_id>', methods=['GET'])
def get_user_jar_transactions(user_id, jar_id):
    try:
        # Query to get all transactions for the user and specific jar ordered by date
        transactions = Transaction.query.filter_by(user_id=user_id, jar_id=jar_id).order_by(Transaction.transaction_date.desc()).all()
        
        # Convert transaction objects to dictionaries
        transaction_list = [{
            'transaction_id': transaction.transaction_id,
            'transaction_date': transaction.transaction_date,
            'amount': float(transaction.amount),
            'category': transaction.category,
            'description': transaction.description,
            'pre_account_total': float(transaction.pre_account_total),
            'post_account_total': float(transaction.post_account_total)
        } for transaction in transactions]

        return jsonify({'transactions': transaction_list}), 200

    except Exception as e:
        # Log the error and return a generic error message
        print(f"Error fetching transactions for user {user_id} and jar {jar_id}: {e}")
        return jsonify({'error': 'An error occurred while fetching transactions'}), 500

@app.route('/create_account', methods=['POST'])
def create_account():
    data = request.json
    user_id = data.get('user_id')
    account_name = data.get('account_name')
    account_type = data.get('account_type')
    balance = Decimal(data.get('balance'))

    if not user_id or not account_name or not account_type or not balance:
        return jsonify({'error': 'Missing required fields'}), 400

    # Calculate the pre_account_total for the user
    accounts = Account.query.filter_by(user_id=user_id, is_deleted=False).all()
    pre_account_total = sum(account.balance for account in accounts)

    # Create the new account
    new_account = Account(
        user_id=user_id,
        account_name=account_name,
        account_type=account_type,
        balance=balance,
        after_jar_total=balance
    )

    db.session.add(new_account)
    db.session.commit()

    # Calculate the post_account_total (including the new account)
    post_account_total = pre_account_total + balance

    # Record the transaction for account creation
    transaction = Transaction(
        account_id=new_account.account_id,
        user_id=user_id,
        transaction_date=datetime.now(),
        amount=balance,
        transaction_type='ingoing',
        pre_account_total=pre_account_total,
        post_account_total=post_account_total,
        category='account',
        description='Initial balance on account creation'
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({'message': 'Account created successfully', 'account_id': new_account.account_id}), 201

@app.route('/update_account/<int:account_id>', methods=['PUT'])
def update_account(account_id):
    # Update the details of a specific account
    data = request.json
    account_name = data.get('account_name')
    account_type = data.get('account_type')

    # Fetch the account by its ID
    account = Account.query.get(account_id)
    if not account:
        return jsonify({'error': 'Account not found'}), 404

    # Update the account's name and type if provided
    if account_name:
        account.account_name = account_name
    if account_type:
        account.account_type = account_type

    # Commit the changes to the database
    db.session.commit()
    return jsonify({'message': 'Account updated successfully'}), 200

@app.route('/delete_account/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    account = Account.query.get(account_id)
    if not account:
        return jsonify({'error': 'Account not found'}), 404

    # Calculate the pre_account_total for the user
    accounts = Account.query.filter_by(user_id=account.user_id).all()
    pre_account_total = sum(acc.balance for acc in accounts)

    # Calculate the post_account_total (excluding the account being deleted)
    post_account_total = pre_account_total - account.balance

    # Record the transaction for account deletion
    transaction = Transaction(
        account_id=account_id,
        user_id=account.user_id,
        transaction_date=datetime.now(),
        amount=account.balance,
        transaction_type='outgoing',
        category='account',
        pre_account_total=pre_account_total,
        post_account_total=post_account_total,
        description='Account closure'
    )
    db.session.add(transaction)

    # Delete all jars related to this account
    jars = Jar.query.filter_by(account_id=account_id, is_deleted=False).all()
    for jar in jars:
        jar.is_deleted = True

    # Soft delete the account
    account.is_deleted = True
    db.session.commit()

    return jsonify({'message': 'Account and related jars deleted successfully'}), 200

@app.route('/user_incomes/<int:user_id>', methods=['GET'])
def get_incomes(user_id):
    # Fetch all incomes for a specific user that are not marked as deleted
    incomes = Income.query.filter_by(user_id=user_id, is_deleted=False).all()
    # Convert income objects into a list of dictionaries for JSON response
    return jsonify({'incomes': [{
        'income_id': inc.income_id,
        'name': inc.name,
        'amount': float(inc.amount)
    } for inc in incomes]})

@app.route('/user_expenses/<int:user_id>', methods=['GET'])
def get_expenses(user_id):
    # Fetch all expenses for a specific user that are not marked as deleted
    expenses = Budget.query.filter_by(user_id=user_id, is_deleted=False).all()
    # Convert expense objects into a list of dictionaries for JSON response
    return jsonify({'expenses': [{
        'budget_id': exp.budget_id,
        'expense': exp.expense,
        'category': exp.category,
        'amount': float(exp.amount)
    } for exp in expenses]})

@app.route('/add_income', methods=['POST'])
def add_income():
    # Add a new income entry for a user
    data = request.json
    # Create a new Income object with the provided data
    new_income = Income(
        user_id=data['user_id'],
        name=data['name'],
        amount=data['amount'],
        income_date=datetime.now()
    )
    # Add the new income to the database and commit the changes
    db.session.add(new_income)
    db.session.commit()
    return jsonify({'message': 'Income added successfully'}), 201

@app.route('/add_expense', methods=['POST'])
def add_expense():
    # Add a new expense entry for a user
    data = request.json
    # Create a new Budget object with the provided data
    new_expense = Budget(
        user_id=data['user_id'],
        expense=data['expense'],
        category=data['category'],
        amount=data['amount'],
    )
    # Add the new expense to the database and commit the changes
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({'message': 'Expense added successfully'}), 201

# Created for later development of the frontend.
@app.route('/delete_income/<int:income_id>', methods=['DELETE'])
def delete_income(income_id):
    # Soft delete an income entry by marking it as deleted
    income = Income.query.get(income_id)
    if not income or income.is_deleted:
        return jsonify({'error': 'Income not found'}), 404

    # Mark the income as deleted and commit the changes
    income.is_deleted = True
    db.session.commit()
    return jsonify({'message': 'Income deleted successfully'}), 200

# Created for later development of the frontend.
@app.route('/delete_expense/<int:budget_id>', methods=['DELETE'])
def delete_expense(budget_id):
    # Soft delete an expense entry by marking it as deleted
    expense = Budget.query.get(budget_id)
    if not expense or expense.is_deleted:
        return jsonify({'error': 'Expense not found'}), 404

    # Mark the expense as deleted and commit the changes
    expense.is_deleted = True
    db.session.commit()
    return jsonify({'message': 'Expense deleted successfully'}), 200

@app.route('/update_income/<int:income_id>', methods=['PUT'])
def update_income(income_id):
    # Update the details of a specific income entry
    data = request.json
    income = Income.query.get(income_id)
    if not income or income.is_deleted:
        return jsonify({'error': 'Income not found'}), 404

    # Update the income's name and amount if provided
    income.name = data.get('name', income.name)
    income.amount = data.get('amount', income.amount)
    db.session.commit()
    return jsonify({'message': 'Income updated successfully'}), 200

@app.route('/update_expense/<int:budget_id>', methods=['PUT'])
def update_expense(budget_id):
    # Update the details of a specific expense entry
    data = request.json
    expense = Budget.query.get(budget_id)
    if not expense or expense.is_deleted:
        return jsonify({'error': 'Expense not found'}), 404

    # Update the expense's details if provided
    expense.expense = data.get('expense', expense.expense)
    expense.category = data.get('category', expense.category)
    expense.amount = data.get('amount', expense.amount)
    db.session.commit()
    return jsonify({'message': 'Expense updated successfully'}), 200

@app.route('/export_data/<int:user_id>', methods=['GET'])
def export_data(user_id):
    try:
        # Fetch user data
        user = User.query.get(user_id)
        accounts = Account.query.filter_by(user_id=user_id, is_deleted=False).all()
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        jars = Jar.query.filter_by(user_id=user_id, is_deleted=False).all()
        incomes = Income.query.filter_by(user_id=user_id, is_deleted=False).all()
        expenses = Budget.query.filter_by(user_id=user_id, is_deleted=False).all()

        # Create a CSV file in memory
        output = StringIO()
        writer = csv.writer(output)

        # Write user data
        writer.writerow(['User ID', 'Username', 'Email'])
        writer.writerow([user.user_id, user.username, user.email])

        # Write accounts data
        writer.writerow([])
        writer.writerow(['Accounts'])
        writer.writerow(['Account ID', 'Account Name', 'Account Type', 'Balance'])
        for account in accounts:
            writer.writerow([account.account_id, account.account_name, account.account_type, float(account.balance)])

        # Write transactions data
        writer.writerow([])
        writer.writerow(['Transactions'])
        writer.writerow(['Transaction ID', 'Account ID', 'Jar ID', 'Transaction Date', 'Amount', 'Type', 'Category', 'Description'])
        for transaction in transactions:
            writer.writerow([transaction.transaction_id, transaction.account_id, transaction.jar_id, transaction.transaction_date, float(transaction.amount), transaction.transaction_type, transaction.category, transaction.description])

        # Write jars data
        writer.writerow([])
        writer.writerow(['Jars'])
        writer.writerow(['Jar ID', 'Jar Name', 'Allocated Amount', 'Current Balance', 'Target Amount'])
        for jar in jars:
            writer.writerow([jar.jar_id, jar.jar_name, float(jar.allocated_amount), float(jar.current_balance), float(jar.target_amount or 0)])

        # Write incomes data
        writer.writerow([])
        writer.writerow(['Incomes'])
        writer.writerow(['Income ID', 'Name', 'Amount'])
        for income in incomes:
            writer.writerow([income.income_id, income.name, float(income.amount)])

        # Write expenses data
        writer.writerow([])
        writer.writerow(['Expenses'])
        writer.writerow(['Budget ID', 'Expense', 'Category', 'Amount'])
        for expense in expenses:
            writer.writerow([expense.budget_id, expense.expense, expense.category, float(expense.amount)])

        # Return the CSV file as a response
        output.seek(0)
        return output.getvalue(), 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=user_data.csv'
        }
    except Exception as e:
        logging.error(f"Error exporting data for user {user_id}: {e}")
        return jsonify({'error': 'An error occurred while exporting data'}), 500

if __name__ == '__main__':
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")

    app.run(debug=True)