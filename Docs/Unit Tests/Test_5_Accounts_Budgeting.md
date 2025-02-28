# Unit Test Documentation: Accounts and Budgeting Functionality

## Overview

This document provides details on the unit tests for the account and budgeting-related functionalities in the finance tracking app. These tests ensure that the application correctly handles operations related to creating, updating, deleting accounts, and managing incomes and expenses.

## Test File

- **File Name:** `test_accounts_budget_functionality.py`
- **Test Framework:** `pytest`

## Purpose

The purpose of these tests is to ensure that the endpoints for creating, updating, and deleting accounts, as well as adding, updating, and deleting incomes and expenses:

- Correctly handle requests by validating input and manipulating account and budget-related data.
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

### `test_create_account`

- **Fixture:** `client`
  - Configures the Flask application for testing.
  - Sets the database URI to use an in-memory SQLite database.
  - Creates and tears down the database for each test run.

**Test Steps:**

1. **Arrange:** Register a test user and prepare a mock payload with account creation details.
2. **Act:** Send a POST request to the `/create_account` endpoint to create a new account.
3. **Assert:**
   - Verify that the response status code is `201 Created`.
   - Confirm that the account data in the database matches the data sent.

### `test_update_account`

**Test Steps:**

1. **Arrange:** Register a test user and create an account.
2. **Act:** Send a PUT request to the `/update_account/<account_id>` endpoint to update account details.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the account data in the database is updated correctly.

### `test_delete_account`

**Test Steps:**

1. **Arrange:** Register a test user and create an account.
2. **Act:** Send a DELETE request to the `/delete_account/<account_id>` endpoint to delete the account.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the account is soft deleted in the database.

### `test_add_income`

**Test Steps:**

1. **Arrange:** Register a test user.
2. **Act:** Send a POST request to the `/add_income` endpoint to add new income.
3. **Assert:**
   - Verify that the response status code is `201 Created`.
   - Confirm that the income data is correctly stored in the database.

### `test_add_expense`

**Test Steps:**

1. **Arrange:** Register a test user.
2. **Act:** Send a POST request to the `/add_expense` endpoint to add a new expense.
3. **Assert:**
   - Verify that the response status code is `201 Created`.
   - Confirm that the expense data is correctly stored in the database.
  
### `test_delete_income`

**Test Steps:**

1. **Arrange:** Register a test user and add income.
2. **Act:** Send a DELETE request to the `/delete_income/<income_id>` endpoint to delete the income.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the income is soft deleted in the database.

### `test_delete_expense`

**Test Steps:**

1. **Arrange:** Register a test user and add an expense.
2. **Act:** Send a DELETE request to the `/delete_expense/<budget_id>` endpoint to delete the expense.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the expense is soft deleted in the database.
  
### `test_update_income`

**Test Steps:**

1. **Arrange:** Register a test user and add income.
2. **Act:** Send a PUT request to the `/update_income/<income_id>` endpoint to update income details.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the income data in the database is updated correctly.

### `test_update_expense`

**Test Steps:**

1. **Arrange:** Register a test user and add an expense.
2. **Act:** Send a PUT request to the `/update_expense/<budget_id>` endpoint to update expense details.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the expense data in the database is updated correctly.

## Running the Tests

To execute the tests, run the following command in the terminal:

```bash
pytest -v test_accounts_budget_functionality.py
```

## Test Results

The unit tests for accounts and budgeting functionality were successfully executed, confirming that the application correctly handles these processes, ensuring data integrity and reliable financial tracking.

```bash
================================================= test session starts =================================================
platform win32 -- Python 3.13.1, pytest-8.3.4, pluggy-1.5.0 -- C:\Python313\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\harri\OneDrive\Documents\GitHub\elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend
plugins: flask-1.3.0
collected 9 items

test_accounts_budget_functionality.py::test_create_account PASSED                                               [ 11%]
test_accounts_budget_functionality.py::test_update_account PASSED                                               [ 22%]
test_accounts_budget_functionality.py::test_delete_account PASSED                                               [ 33%]
test_accounts_budget_functionality.py::test_add_income PASSED                                                   [ 44%]
test_accounts_budget_functionality.py::test_add_expense PASSED                                                  [ 55%]
test_accounts_budget_functionality.py::test_delete_income PASSED                                                [ 66%]
test_accounts_budget_functionality.py::test_delete_expense PASSED                                               [ 77%]
test_accounts_budget_functionality.py::test_update_income PASSED                                                [ 88%]
test_accounts_budget_functionality.py::test_update_expense PASSED                                               [100%]
```

## Conclusion

These unit tests ensure that the critical operations of creating, updating, and deleting accounts, as well as managing incomes and expenses, are functioning correctly, providing secure and reliable interactions with the database.
