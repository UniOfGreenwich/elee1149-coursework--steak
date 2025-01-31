# Unit Test Documentation: User Registration, Login, and Forgot Password

## Overview

This document provides details on the unit tests for the user registration, login, and password recovery functionalities in the finance tracking app. These tests ensure that the application correctly handles user data operations with the database, both for writing and reading data.

## Test File

- **File Name:** `test_1_app.py`
- **Test Framework:** `pytest`

## Purpose

The purpose of these tests is to ensure that the endpoints for registration, login, and forgot password:

- Correctly handle user requests by validating input, managing sensitive data securely, and interacting with the database.
- Allow reading from the database to verify that data is stored and retrieved correctly and consistently.

## Test Setup

### Prerequisites

Ensure Python packages `pytest`, `pytest-flask`, and `flask-sqlalchemy` are installed.

```bash
pip install pytest pytest-flask flask-sqlalchemy
```

### Configuration

The tests use an in-memory SQLite database to prevent any impact on production data.

## Test Descriptions

### `test_register_user`

- **Fixture:** `client`
  - Configures the Flask application for testing.
  - Sets the database URI to use an in-memory SQLite database.
  - Creates and tears down the database for each test run.

**Test Steps:**

1. **Arrange:** Prepare a mock payload containing user registration details.
2. **Act:**
   - Send a POST request to the `/register` endpoint to write data to the database.
   - Query the database to read back the stored user information.
3. **Assert:**
   - Verify that the response status code is `201 Created`.
   - Confirm that the user data read from the database matches the data sent.

### `test_login_user`

**Test Steps:**

1. **Arrange:** Register a test user using the `/register` endpoint.
2. **Act:** Send a POST request to the `/login` endpoint with the user's credentials.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Check that the success message is returned and the user ID is correct.

### `test_forgot_password`

**Test Steps:**

1. **Arrange:** Register a test user and simulate a password recovery scenario.
2. **Act:** Send a POST request to the `/forgot-password` endpoint with the user's security answer and new password.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the password is updated in the database by attempting a login with the new password.

## Running the Tests

To execute the tests, run the following command in the terminal:

```bash
pytest -v test_1_app.py
```

## Test Results

The unit tests for registration, login, and forgot password were successfully executed, confirming that the application correctly handles these processes, maintaining data integrity and reliability.

```bash
================================================= test session starts =================================================
platform win32 -- Python 3.13.1, pytest-8.3.4, pluggy-1.5.0 -- C:\Python313\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\harri\OneDrive\Documents\GitHub\elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend
plugins: flask-1.3.0
collected 3 items

test_1_app.py::test_register_user PASSED                                                                         [ 33%]
test_1_app.py::test_login_user PASSED                                                                            [ 66%]
test_1_app.py::test_forgot_password PASSED                                                                       [100%]
```

## Conclusion

These unit tests ensure that the critical user operations of registration, login, and password recovery are functioning correctly, providing secure and reliable interactions with the database.
