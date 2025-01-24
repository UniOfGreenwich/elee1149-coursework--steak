# Finance Manager Application - Requirements Document

## 1. Project Overview

This document outlines the requirements for a finance manager application named 'Steak', designed to help users track their income, expenses, assets, and progress towards financial goals.  The application will feature a React frontend and a Python backend using Flask and SQLAlchemy.

## 2. Stakeholders

*   **Product Owners:** Harrison, Lewis, Jack, Gareth
*   **Development Team:** Harrison, Lewis, Jack, Gareth
*   **End-Users:** People looking to manage their personal finances.

## 3. Objectives

*   Provide a user-friendly interface for tracking financial transactions.
*   Enable users to set and monitor financial goals.
*   Offer insightful reports and summaries of financial data.
*   Ensure data security and privacy.

## 4. Functional Requirements

### 4.1 Pre-Main Page:

*   **Login Page:**
    *   Username/email and password login.  Authentication handled securely by Flask.
    *   Error handling for incorrect logins (Flask error handling).
    *   Links to registration and password reset.
*   **Registration Page:**
    *   Required fields: username, email, password, password confirmation.
    *   Password strength validation (client-side and server-side validation).
    *   Email verification (using a service like SendGrid or similar).
    *   Clear error messages (Flask error handling).
*   **First-time Account Setup:**
    *   Form for adding initial bank account information (bank name, account number, account type, initial balance).  Data validated using SQLAlchemy.
    *   Support for multiple bank accounts.
    *   Option for manual balance input. Automated fetching will be considered in later sprints.
*   **Forgot Password:**
    *   Password reset via email link (using a service like SendGrid or similar).
    *   Secure password reset mechanism (time-limited tokens, managed by Flask).


### 4.2 Main Page:

*   **Income/Outcome History:**
    *   Add, edit, and delete transactions. Data persistence handled by SQLAlchemy.
    *   Fields: date, description, amount, account.
    *   Customizable transaction categories (stored in the database).
    *   Organized display (table or list view, filterable).
    *   Export functionality (CSV, PDF).
*   **Money Jars (Goals):**
    *   Create savings goals with target amount and deadline (SQLAlchemy data model).
    *   Track progress towards goals (calculated using SQLAlchemy queries).
    *   Option for automated fund allocation (future sprint or concept research).
*   **Asset Total:**
    *   Display total assets (bank accounts, investments, etc.).  Data fetched from the SQLAlchemy database.
    *   Form to add and update assets (SQLAlchemy data model).
*   **Logout:**
    *   Secure logout functionality.
*   **Budgeting:**
    *   Set monthly budgets for income and expenses (SQLAlchemy data model).
    *   Compare budget vs. actual spending (SQLAlchemy queries).
    *   Budget alerts (future sprint).

### 4.3 TBD Features:

*   **Net Worth Asset Tracker:**  Detailed specification needed.
*   **Financial News:**  Source of news (API, RSS), display method, relevance filtering.
*   **Blog Page:**  Content source, user interaction (comments, etc.).
*   **Badges:**  Achievement criteria, badge design, display.


## 5. Non-Functional Requirements

*   **Security:** Encrypted database fields (passwords, financial data).  Use SQLAlchemy's encryption features or integrate a hashing algorithm.
*   **Performance:** Quick response times (e.g., under 2 seconds for most actions).  Optimize database queries.
*   **Error Handling:** Comprehensive error handling with user-friendly messages.  Utilize Flask's error handling mechanisms.
*   **Access Control:** Restricted access based on user roles (Flask-Login or similar).
*   **Usability & Accessibility:**  Adherence to accessibility guidelines.
*   **Deployment:** Initially local for proof of concept, scalable architecture for future deployment.

## 6. Technology Stack

*   **Frontend:** React
*   **Backend:** Python (Flask)
*   **Database:** SQLAlchemy (SQLite)

## 7.  Milestones

*   **Sprint 1:** Prepare documentation outlines, design a high-level system architecture, list requirements, database design (SQLAlchemy models), and compile basic feature flowcharts.
*   **Sprint 2:** Complete the login and registration pages, design the landing page, and create the account information form.
*   **Sprint 3:** 


## 8.  Acceptance Criteria

Relate to User stories .. if applicable.


## 9. Glossary

*   **TBD:** To be determined.


## 10. Appendices

[Add any additional information or documents here]
