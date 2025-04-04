## Agile Documentation Outline for Personal Finance Tracker

### 1. Project Charter

#### 1.1 Purpose and Objectives:
Steak is a web-based tool designed to simplify personal money management. Users can input their bank balances, allocate money to savings ("Money Jars"), and track transactions and budgets. The goal is to provide an easy-to-use platform for users to stay on top of their finances.

#### 1.2 Stakeholders:
- **End Users**: People looking for an easy way to manage personal finances.
- **Developers**: Building and maintaining the project.
- **Business Analysts**: Ensuring the project meets user needs and business goals.
- **Project Manager**: Overseeing project milestones and delivery.
- **Cloud Hosting Providers**: Google Cloud Platform (GCP).

#### 1.3 Scope:
The project will include:
- User authentication and registration
- Budgeting and transaction tracking features
- "Money Jar" savings allocation
- Data export functionality
- Dynamic financial graphing

---

### 2. User Stories & Backlog

#### 2.1 User Stories:
- **As a user**, I want to register and log in securely to access my finances.
- **As a user**, I want to allocate money into savings jars for specific financial goals.
- **As a user**, I want to track my income and expenses through a budgeting sheet.
- **As a user**, I want to see my financial data visualized in dynamic graphs.
- **As a user**, I want to export my financial data for future reference.

#### 2.2 Acceptance Criteria:
- Users can register, log in, and log out securely.
- Users can create and manage savings "Money Jars."
- Users can track transactions and expenses using a budgeting sheet.
- Financial data is displayed using dynamic graphs (pie charts, line graphs).
- Data export is available in CSV format.

#### 2.3 Product Backlog:
- **User Login & Registration** (User Story 1)
- **Money Jar Allocation** (User Story 2)
- **Budgeting & Transactions** (User Story 3)
- **Dynamic Graphs** (User Story 4)
- **Data Export** (User Story 5)
- **Financial News Feed** (Additional Feature)
- **Product Advertisement Carousel** (Additional Feature)

---

### 3. Sprint Documentation

#### 3.1 Sprint Plans:
- [Sprint Planning](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/Sprint%20Planning)

#### 3.2 Sprint Reviews and Retrospectives:
- [Sprint Reviews](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/Sprint%20Planning)

---

### 4. Technical Documentation

#### 4.1 System Architecture:
The backend is powered by Python with Flask and hosted on Google Cloud Platform. SQLite is used for local storage, and PostgreSQL is used for production databases.

#### 4.2 Database Schema:
- **Users** (id, username, password_hash, email, created_at, updated_at, new, security_1, security_2, security_3)
- **Accounts** (id, user_id, account_name, account_type, balance, after_jar_total, created_at, updated_at, is_deleted)
- **Transactions** (id, account_id, user_id, jar_id, transaction_date, amount, transaction_type, pre_account_total, post_account_total, category, description, created_at, source_account_id, destination_account_id, source_jar_id, destination_jar_id)
- **Jars** (id, user_id, account_id, jar_name, allocated_amount, current_balance, target_amount, created_at, updated_at, is_deleted)
- **Incomes** (id, user_id, name, amount, income_date, created_at, is_deleted)
- **Budgets** (id, user_id, expense, category, amount, created_at, updated_at, is_deleted)

#### 4.3 API Specifications:
-   `POST /register`: Signs up a new user. You'll send things like username, password, email, and answers to secret questions.
-   `POST /login`: Lets a user log in. You'll need to send your username and password.
-   `GET /user_transactions/<int:user_id>`: Shows all the money moves for a specific user. You need to put the user's special number in the web address.
-   `POST /create_transaction`: Lets you add a new money move. You'll send info about which account, how much money, if it's coming in or going out, and maybe what it was for.
-   `POST /create_account`: Adds a new bank account for a user. You'll send the user's special number, the account's name, what kind of account it is, and how much money is in it at the start.
-   `GET /total_balance/<int:user_id>`: Shows the total amount of money a user has in all their accounts. You need to put the user's special number in the web address.
-   `POST /create_jar`: Creates a new "jar" (like a piggy bank for a special goal) for an account. You'll send the user's special number, the account's special number, the jar's name, and how much money to put in it.
-   `GET /user_jars/<int:user_id>`: Shows all the "jars" a user has. You need to put the user's special number in the web address.
-   `PUT /update_jar/<int:jar_id>`: Lets you change the name or how much money you want to save in a "jar". You need to put the jar's special number in the web address and send the new info.
-   `DELETE /delete_jar/<int:jar_id>`: Removes a "jar". You need to put the jar's special number in the web address.
-   `PUT /update_account/<int:account_id>`: Lets you change the name or type of a bank account. You need to put the account's special number in the web address and send the new info.
-   `DELETE /delete_account/<int:account_id>`: Removes a bank account. You need to put the account's special number in the web address.
-   `POST /forgot-password`: Helps a user get their password back if they forget it. They'll need to answer those secret questions.
-   `POST /setup`: Sets up a new account for a user with some money to start.
-   `POST /update_new_status/<int:user_id>`: Changes if a user is marked as "new" or not.
-   `GET /user_jar_transactions/<int:user_id>/<int:jar_id>`: Shows all the money moves that went in or out of a specific "jar". You need to put the user's special number and the jar's special number in the web address.
-   `GET /user_incomes/<int:user_id>`: Shows all the money a user has earned.
-   `GET /user_expenses/<int:user_id>`: Shows all the things a user spends money on.
-   `POST /add_income`: Lets you add a new way a user earns money.
-   `POST /add_expense`: Lets you add something new that a user spends money on.
-   `DELETE /delete_income/<int:income_id>`: Removes a way a user earns money from the list.
-   `DELETE /delete_expense/<int:budget_id>`: Removes something a user spends money on from the list.
-   `PUT /update_income/<int:income_id>`: Lets you change the details about how a user earns money.
-   `PUT /update_expense/<int:budget_id>`: Lets you change the details about something a user spends money on.
-   `GET /export_data/<int:user_id>`: Lets you download all of a user's info in a file.

---

### 5. Quality Assurance

#### 5.1 Testing Plans:
- Unit tests and integration tests for the backend functionality.
- UI/UX tests to ensure usability of the app interface.
- [Unit Tests](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/Unit%20Tests)  
- [System Modelling](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/System%20Modelling) 

#### 5.2 Bug Reports and Tracking:
- GitHub Issues will be used to track bugs and features.

---

### 6. Release Notes

#### 6.1 Features:
- Completed user login and registration.
- Implemented "Money Jar" allocation.
- Added budgeting and dynamic financial graphs.

#### 6.2 Bug Fixes:
- Fixed issues with transaction date formats.
- Addressed minor UI glitches.

#### 6.3 Known Issues:
- Financial news feed may fail to load intermittently.

#### 6.4 Stakeholder Communication:
- Weekly updates will be sent to stakeholders.

---

### 7. Risk Management Document

#### 7.1 Risk Identification:
- Data privacy concerns and potential security breaches.
- Third-party API dependencies for the news feed.

#### 7.2 Mitigation Strategies:
- Use HTTPS for secure connections and strong encryption for passwords.
- Regularly monitor third-party API status and implement fallback options.

#### 7.3 Contingency Plans:
- Implement backup API services.
- Prepare user documentation for potential onboarding challenges.

---

### 8. COCOMO Calculations

#### 8.1 Effort Estimation:
- The project is estimated to take 4 person-months based on feature complexity.

#### 8.2 Adjustments:
- Effort estimation may change depending on any unforeseen technical challenges.

---

### 9. Documentation for Continuous Improvement

#### 9.1 Feedback Log:
- Collect feedback from users and stakeholders for continuous improvement.

#### 9.2 Improvement Tracking:
- Improvements will be tracked through GitHub Issues and sprints.
