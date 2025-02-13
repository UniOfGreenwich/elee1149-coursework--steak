# Activity Diagrams

## User Registration Process

```mermaid
flowchart TD
    A[Start Registration] --> B{Are all fields filled?}
    B -- No --> C[Display error]
    B -- Yes --> D{Is username unique?}
    D -- No --> E[Display error]
    D -- Yes --> F[Hash password and security answers]
    F --> G[Create new user]
    G --> H[Add user to database]
    H --> I[Display success message]
    I --> J[End Registration]
```

## User Login Process

```mermaid
flowchart TD
    A[Start Login] --> B{Are username and password provided?}
    B -- No --> C[Display error]
    B -- Yes --> D[Find user by username]
    D --> E{Are credentials valid?}
    E -- No --> F[Display error]
    E -- Yes --> G[Login successful]
    G --> H[Display success message]
    H --> I[End Login]
```

## Forgot Password Process

```mermaid
flowchart TD
    A[Start Forgot Password] --> B{Are all fields filled?}
    B -- No --> C[Display error]
    B -- Yes --> D{Do passwords match?}
    D -- No --> E[Display error]
    D -- Yes --> F[Find user by username]
    F --> G{Is user found?}
    G -- No --> H[Display error]
    G -- Yes --> I[Verify security answer]
    I --> J{Is security answer correct?}
    J -- No --> K[Display error]
    J -- Yes --> L[Update user's password]
    L --> M[Display success message]
    M --> N[End Forgot Password]
```

## Account Information Form Process

```mermaid
flowchart TD
    A[Start] --> B[Check user account status]
    B --> C{Is 'new' status true?}
    C -- No --> D[Do not display form]
    C -- Yes --> E[Display account information form]
    E --> F[User fills in form]
    F --> G[User submits form]
    G --> H{Is form valid?}
    H -- No --> I[Display error message]
    I --> E
    H -- Yes --> J[Process form data]
    J --> K[Update account information]
    K --> L[Display success message]
    D --> M[End Account Form]
    L --> M[End Account Form]
```

## Total Balance Process

```mermaid
flowchart TD
    A[Start Total Balance Calculation] --> B[Fetch accounts for user]
    B --> C{Error fetching accounts?}
    C -- Yes --> D[Display error message]
    C -- No --> E[Calculate total balance and available total]
    E --> F[Display balance information]
    F --> G[End Total Balance Calculation]
    D --> G
```

## Create Jar Process

```mermaid
flowchart TD
    A[Start Create Jar] --> B[Check required fields]
    B --> C{Are fields missing?}
    C -- Yes --> D[Display error message]
    C -- No --> E[Fetch account]
    E --> F{Is account found?}
    F -- No --> G[Display error message]
    F -- Yes --> H{Is allocated amount valid?}
    H -- No --> I[Display error message]
    H -- Yes --> J[Create new jar]
    J --> K[Update after_jar_total]
    K --> L[Display success message]
    L --> M[End Create Jar]
    D --> M
    G --> M
    I --> M
```

## Get User Jars Process

```mermaid
flowchart TD
    A[Start Get User Jars] --> B[Fetch jars for user]
    B --> C{Error fetching jars?}
    C -- Yes --> D[Display error message]
    C -- No --> E[Display jar details]
    E --> F[End Get User Jars]
    D --> F
```

## Update Jar Process

```mermaid
flowchart TD
    A[Start Update Jar] --> B[Fetch jar by ID]
    B --> C{Is jar found?}
    C -- No --> D[Display error message]
    C -- Yes --> E[Update jar details]
    E --> F[Display success message]
    F --> G[End Update Jar]
    D --> G
```

## Delete Jar Process

```mermaid
flowchart TD
    A[Start Delete Jar] --> B[Fetch jar by ID]
    B --> C{Is jar found?}
    C -- No --> D[Display error message]
    C -- Yes --> E[Soft delete jar]
    E --> F[Update after_jar_total]
    F --> G[Display success message]
    G --> H[End Delete Jar]
    D --> H
```
