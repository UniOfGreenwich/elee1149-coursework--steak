# Unit Test Documentation: Setup Form, Update New Status, and Total Balance Display

## Overview

This document provides detailed information about the unit tests for the setup form creation, updating the new user status, and displaying the total balance functionalities in the finance tracking app. These tests ensure that the application processes account-related data accurately and updates user statuses correctly.

## Test File

- **File Name:** `test_account_features.py`
- **Test Framework:** `pytest`

## Purpose

The purpose of these tests is to ensure that the endpoints for setup form creation, updating new status, and total balance display:

- Correctly handle requests by validating input and manipulating account-related data.
- Interact with the database to ensure data consistency and correct calculations.
  
## Test Setup

### Prerequisites

Ensure Python packages `pytest`, `pytest-flask`, and `flask-sqlalchemy` are installed.

```bash
pip install pytest pytest-flask flask-sqlalchemy
```

### Configuration

The tests use an in-memory SQLite database to prevent any impact on production data.

## Test Descriptions

### `test_setup_form_creation`

- **Fixture:** `client`
  - Configures the Flask application for testing.
  - Sets the database URI to use an in-memory SQLite database.
  - Creates and tears down the database for each test run.

**Test Steps:**

1. **Arrange:** Register a test user and prepare a mock payload with account setup details.
2. **Act:**
    - Send a POST request to the /setup endpoint to create a new account.
    - Query the database to verify the new account's details.
3. **Assert:**
    - Verify that the response status code is 200 OK.
    - Confirm that the account data in the database matches the data sent.
  
### `test_update_new_status`

**Test Steps:**

1. **Arrange:** Register a test user.
2. **Act:** Send a POST request to the /update_new_status/<user_id> endpoint to change the user's new status.
3. **Assert:**
    - Verify that the response status code is 200 OK.
    - Check that the user's new status is correctly updated in the database.

### `test_total_balance_display`

**Test Steps:**

1. **Arrange:** Register a test user and create multiple accounts for the user.
2. **Act:** Send a GET request to the /total_balance/<user_id> endpoint to retrieve the user's total balance.
3. **Assert:**
    - Verify that the response status code is 200 OK.
    - Confirm that the total balance and account details are calculated and returned correctly.

## Running the Tests

To execute the tests, run the following command in the terminal:

```bash
pytest -v test_account_features.py
```

##Test Results

The unit tests for setup form creation, updating new status, and total balance display were successfully executed, confirming that the application correctly handles these processes, ensuring data integrity and accurate calculations.

```bash
 ================================================= test session starts =================================================
platform win32 -- Python 3.13.1, pytest-8.3.4, pluggy-1.5.0 -- C:\Python313\python.exe
cachedir: .pytest_cache
rootdir:C:\Users\harri\OneDrive\Documents\GitHub\elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend
plugins: flask-1.3.0
collected 3 items

test_account_features.py::test_setup_form_creation PASSED                                                                         [ 33%]
test_account_features.py::test_update_new_status PASSED                                                                           [ 66%]
test_account_features.py::test_total_balance_display PASSED                                                                       [100%]
```

Conclusion

These unit tests ensure that the critical account operations of setup form creation, updating new status, and total balance display are functioning correctly, providing secure and reliable interactions with the database.
