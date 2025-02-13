# Unit Test Documentation: Jar Functionality

## Overview

This document provides details on the unit tests for the jar-related functionalities in the finance tracking app. These tests ensure that the application correctly handles operations related to creating, retrieving, updating, and deleting jars.

## Test File

- **File Name:** `test_jar_functionality.py`
- **Test Framework:** `pytest`

## Purpose

The purpose of these tests is to ensure that the endpoints for creating jars, retrieving user jars, updating jars, and deleting jars:

- Correctly handle requests by validating input and manipulating jar-related data.
- Interact with the database to ensure data consistency and accurate calculations.

## Test Setup

### Prerequisites

Ensure Python packages `pytest`, `pytest-flask`, and `flask-sqlalchemy` are installed.

```bash
pip install pytest pytest-flask flask-sqlalchemy
```

### Configuration

The tests use an in-memory SQLite database to prevent any impact on production data.

## Test Descriptions

### `test_create_jar`

- **Fixture:** `client`
  - Configures the Flask application for testing.
  - Sets the database URI to use an in-memory SQLite database.
  - Creates and tears down the database for each test run.

**Test Steps:**

1. **Arrange:** Register a test user, create an account, and prepare a mock payload with jar creation details.
2. **Act:** Send a POST request to the `/create_jar` endpoint to create a new jar.
3. **Assert:**
   - Verify that the response status code is `201 Created`.
   - Confirm that the jar data in the database matches the data sent.

### `test_get_user_jars`

**Test Steps:**

1. **Arrange:** Register a test user, create an account, and create a jar.
2. **Act:** Send a GET request to the `/user_jars/<user_id>` endpoint to retrieve the user's jars.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the correct jar details are returned.

### `test_update_jar`

**Test Steps:**

1. **Arrange:** Register a test user, create an account, and create a jar.
2. **Act:** Send a PUT request to the `/update_jar/<jar_id>` endpoint with updated jar details.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the jar data in the database is updated correctly.

### `test_delete_jar`

**Test Steps:**

1. **Arrange:** Register a test user, create an account, and create a jar.
2. **Act:** Send a DELETE request to the `/delete_jar/<jar_id>` endpoint to delete the jar.
3. **Assert:**
   - Verify that the response status code is `200 OK`.
   - Confirm that the jar is soft deleted in the database.

## Running the Tests

To execute the tests, run the following command in the terminal:

```bash
pytest -v test_jar_functionality.py
```

## Test Results

The unit tests for jar functionality were successfully executed, confirming that the application correctly handles these processes, ensuring data integrity and reliable operations.

```bash
================================================= test session starts =================================================
platform win32 -- Python 3.13.1, pytest-8.3.4, pluggy-1.5.0 -- C:\Python313\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\harri\OneDrive\Documents\GitHub\elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend
plugins: flask-1.3.0
collected 4 items

test_jar_functionality.py::test_create_jar PASSED                                                                [ 25%]
test_jar_functionality.py::test_get_user_jars PASSED                                                             [ 50%]
test_jar_functionality.py::test_update_jar PASSED                                                                [ 75%]
test_jar_functionality.py::test_delete_jar PASSED                                                                [100%]
```

## Conclusion

These unit tests ensure that the critical jar operations of creating, retrieving, updating, and deleting are functioning correctly, providing secure and reliable interactions with the database.
