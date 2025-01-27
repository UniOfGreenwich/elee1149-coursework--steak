# Meeting Notes: Python Backend Runtime Installation

**Date:** 27/01/2025

**Attendees:** Harrison, Jack

---

### Meeting Notes

#### Python Installation

- **Overview:**
  - Harrison guided Jack through installing and setting up Python, including checking the version and installing necessary packages.

- **Key Steps:**
  - **Checking Python Version:**
    - Harrison instructed Jack to open the command prompt and check the Python version using:
      ```bash
      python --version
      ```
    - This was to ensure Python was installed correctly.

  - **Installing Packages:**
    - Jack was guided through installing necessary packages using:
      ```bash
      python -m pip install flask flask_sqlalchemy flask_cors werkzeug
      ```
    - A link with required packages was provided in the chat.

  - **Command Execution:**
    - Jack encountered issues with commands, but Harrison provided step-by-step instructions to resolve them, ensuring correct installation.

#### Running Python Script

- **Process:**
  - Harrison instructed Jack on navigating to the Python backend folder and running the script to verify application functionality.

- **Key Steps:**
  - **Navigate to Folder:**
    - Used command:
      ```bash
      cd elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend
      ```
    - To ensure they were in the correct directory.

  - **Running Script:**
    - Ran the script using:
      ```bash
      python app.py
      ```
    - To start the application and verify functionality.

  - **Frontend Interaction:**
    - Harrison explained that Jack should interact with the frontend by logging in or signing up to test integration.

#### Frontend and Backend Integration

- **Testing:**
  - Harrison and Jack tested integration, focusing on user registration and login functionalities.

- **Results:**
  - **User Registration:**
    - Jack successfully created a new account, confirming backend request handling.

  - **User Login:**
    - Successful login confirmed integration between frontend and backend.

  - **Data Handling:**
    - Harrison noted that data entered during login/registration was not saved, indicating the need for further testing of data persistence.

#### Forgot Password Functionality

- **Testing:**
  - Harrison asked Jack to test forgot password functionality to ensure it worked without issues.

#### Final Steps and Pull Request

- **Actions:**
  - Harrison reminded Jack to push the branch and create a pull request once tasks are completed.
  - Jack has another ticket to work on before completing the pull request.

---

### Follow-up Tasks

1. **Push Branch and Pull Request:**
   - Push the branch and create a pull request after completing the task. *(Jack)*

2. **Complete Other Ticket:**
   - Complete the other ticket before pushing the branch and creating the pull request. *(Jack)*
