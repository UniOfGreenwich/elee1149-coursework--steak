# Unit Test Documentation: Transaction Functionality

## Overview

This document provides details on the unit tests for the transaction-related functionalities in the finance tracking app. These tests ensure that the application correctly handles operations related to creating transactions and retrieving transactions for users and specific jars.

## Test File

- **File Name:** `test_transaction_functionality.py`
- **Test Framework:** `pytest`

## Purpose

The purpose of these tests is to ensure that the endpoints for creating transactions, retrieving user transactions, and retrieving transactions for specific jars:

- Correctly handle requests by validating input and manipulating transaction-related data.
- Interact with the database to ensure data consistency and accurate financial tracking.

## Test Setup

### Prerequisites

Ensure Python packages `pytest`, `pytest-flask`, and `flask-sqlalchemy` are installed.

```bash
pip install pytest pytest-flask flask-sqlalchemy
```

### Configuration

The tests use an in-memory SQLite database to prevent any impact on production data.

## Test Descriptions

### `test_create_transaction`

- **Fixture:** `client`
  - Configures the Flask application for testing.
  - Sets the database URI to use an in-memory SQLite database.
  - Creates and tears down the database for each test run.

**Test Steps:**

1. **Arrange:** Register a test user, create an account, create a jar, and prepare a mock payload with transaction details.
2. **Act:** Send a POST request to the `/create_transaction` endpoint to create a new transaction.
3. **Assert:**
   - Verify that the response status code is `201 Created`.
   - Confirm that the transaction data in the database matches the data sent.

### `test_get_user_transactions`

**Test Steps:**

1. **Arrange:** Register a test user, create an account, create a jar, and create a transaction.
2. **Act:** Send a GET request to the `/user_transactions/<user_id>` endpoint to retrieve the user's transactions.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the correct transactions, including the initial balance transaction, are returned.

### `test_get_user_jar_transactions`

**Test Steps:**

1. **Arrange:** Register a test user, create an account, create a jar, and create a transaction involving the jar.
2. **Act:** Send a GET request to the `/user_jar_transactions/<user_id>/<jar_id>` endpoint to retrieve transactions for the specific jar.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the correct jar transactions are returned.

## Running the Tests

To execute the tests, run the following command in the terminal:

```bash
pytest -v test_transaction_functionality.py
```

## Test Results

The unit tests for jar functionality were successfully executed, confirming that the application correctly handles these processes, ensuring data integrity and reliable operations.

```bash
================================================= test session starts =================================================
platform win32 -- Python 3.13.1, pytest-8.3.4, pluggy-1.5.0 -- C:\Python313\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\harri\OneDrive\Documents\GitHub\elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend
plugins: flask-1.3.0
collected 3 items

test_transaction_functionality.py::test_create_transaction PASSED                                               [ 33%]
test_transaction_functionality.py::test_get_user_transactions PASSED                                            [ 66%]
test_transaction_functionality.py::test_get_user_jar_transactions PASSED                                        [100%]
```

## Conclusion

These unit tests ensure that the critical transaction operations of creating transactions, retrieving user transactions, and retrieving jar-specific transactions are functioning correctly, providing secure and reliable interactions with the database.
