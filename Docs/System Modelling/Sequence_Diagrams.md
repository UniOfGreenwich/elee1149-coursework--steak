# Sequence Diagrams

## User Registration

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Fill registration form
    Frontend ->> Backend: POST /register
    alt Missing required fields
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Username already exists
        Backend ->> Frontend: Return error (409)
        Frontend ->> User: Display error
    else Valid request
        Backend ->> Backend: Hash password and security answers
        Backend ->> Backend: Create new User
        Backend ->> Backend: Add User to database
        Backend ->> Frontend: User registered successfully (201)
        Frontend ->> User: Display success message
    end
```

## User Login

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Fill login form
    Frontend ->> Backend: POST /login
    alt Missing username or password
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Find user by username
        alt Invalid credentials
            Backend ->> Frontend: Return error (401)
            Frontend ->> User: Display error
        else Valid credentials
            Backend ->> Frontend: Login successful (200)
            Frontend ->> User: Display success message
        end
    end
```

## Forgot Password

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Fill forgot password form
    Frontend ->> Backend: POST /forgot-password
    alt Missing required fields
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Passwords do not match
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Find user by username
        alt User not found
            Backend ->> Frontend: Return error (404)
            Frontend ->> User: Display error
        else Verify security answer
            alt Incorrect security answer
                Backend ->> Frontend: Return error (401)
                Frontend ->> User: Display error
            else Valid answer
                Backend ->> Backend: Update user's password
                Backend ->> Frontend: Password updated successfully (200)
                Frontend ->> User: Display success message
            end
        end
    end
```

## Setup Account

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Fill account setup form
    Frontend ->> Backend: POST /setup
    alt User ID is missing
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Valid request
        Backend ->> Backend: Create new Account
        alt Error during setup
            Backend ->> Backend: Rollback transaction
            Backend ->> Frontend: Return error (500)
            Frontend ->> User: Display error
        else Setup successful
            Backend ->> Frontend: Setup completed successfully (200)
            Frontend ->> User: Display success message
        end
    end
```

## Update User 'New' Status

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Submit status update form
    Frontend ->> Backend: POST /update_new_status/{user_id}
    Backend ->> Backend: Find User by user_id
    alt User not found
        Backend ->> Frontend: Return error (404)
        Frontend ->> User: Display error
    else User found
        Backend ->> Backend: Update 'new' status
        Backend ->> Frontend: User status updated (200)
        Frontend ->> User: Display success message
    end
```

## Total Balance

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Request total balance
    Frontend ->> Backend: GET /total_balance/{user_id}
    alt Error fetching accounts
        Backend ->> Frontend: Return error (500)
        Frontend ->> User: Display error
    else Successful fetch
        Backend ->> Backend: Calculate total balance and available total
        Backend ->> Frontend: Return total balance and account details (200)
        Frontend ->> User: Display balance information
    end
```

## Create Jar

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Submit jar creation form
    Frontend ->> Backend: POST /create_jar
    alt Missing required fields
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Account not found
        Backend ->> Frontend: Return error (404)
        Frontend ->> User: Display error
    else Allocated amount exceeds available balance
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error
    else Valid request
        Backend ->> Backend: Create new Jar
        Backend ->> Backend: Update account's after_jar_total
        Backend ->> Frontend: Jar created successfully (201)
        Frontend ->> User: Display success message
    end
```

## Get User Jars

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Request user jars
    Frontend ->> Backend: GET /user_jars/{user_id}
    alt Error fetching jars
        Backend ->> Frontend: Return error (500)
        Frontend ->> User: Display error
    else Successful fetch
        Backend ->> Frontend: Return jar details (200)
        Frontend ->> User: Display jar information
    end
```

## Update Jar

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Submit jar update form
    Frontend ->> Backend: PUT /update_jar/{jar_id}
    alt Jar not found
        Backend ->> Frontend: Return error (404)
        Frontend ->> User: Display error
    else Jar found
        Backend ->> Backend: Update jar details
        Backend ->> Frontend: Jar updated successfully (200)
        Frontend ->> User: Display success message
    end
```

## Delete Jar

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Request to delete jar
    Frontend ->> Backend: DELETE /delete_jar/{jar_id}
    alt Jar not found
        Backend ->> Frontend: Return error (404)
        Frontend ->> User: Display error
    else Jar found
        Backend ->> Backend: Soft delete jar
        Backend ->> Backend: Update account's after_jar_total
        Backend ->> Frontend: Jar deleted successfully (200)
        Frontend ->> User: Display success message
    end
```

## Create Transaction Process

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Submit transaction form
    Frontend ->> Backend: POST /create_transaction
    Backend ->> Backend: Validate request data
    alt Missing required fields
        Backend ->> Frontend: Return error (400)
        Frontend ->> User: Display error message
    else Fetch account
        Backend ->> Backend: Check sufficient funds (if outgoing)
        alt Insufficient funds
            Backend ->> Frontend: Return error (400)
            Frontend ->> User: Display error message
        else Calculate pre_account_total
            Backend ->> Backend: Apply transaction
            Backend ->> Backend: Commit changes
            Backend ->> Backend: Calculate post_account_total
            Backend ->> Backend: Update after_jar_total (if applicable)
            Backend ->> Backend: Create and save transaction record
            Backend ->> Frontend: Transaction created successfully (201)
            Frontend ->> User: Display success message
        end
    end
```

## Get User Transactions Process

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Request transaction history
    Frontend ->> Backend: GET /user_transactions/{user_id}
    Backend ->> Backend: Fetch transactions for user
    alt Error fetching transactions
        Backend ->> Frontend: Return error (500)
        Frontend ->> User: Display error message
    else Successful fetch
        Backend ->> Frontend: Return transaction list (200)
        Frontend ->> User: Display transaction history
    end
```

## Get User Jar Transactions Process

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User ->> Frontend: Request jar transaction history
    Frontend ->> Backend: GET /user_jar_transactions/{user_id}/{jar_id}
    Backend ->> Backend: Fetch transactions for user and jar
    alt Error fetching transactions
        Backend ->> Frontend: Return error (500)
        Frontend ->> User: Display error message
    else Successful fetch
        Backend ->> Frontend: Return transaction list (200)
        Frontend ->> User: Display transaction history
    end
```
