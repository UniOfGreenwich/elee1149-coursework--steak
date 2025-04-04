<!-- PROJECT LOGO -->
<img src="/SteakAd.gif" alt="advert" width=100%>
  <p align="center">
    A simpler money management tool.
    <br />
    <br />
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#local-prerequisites">Local Prerequisites</a></li>
        <li><a href="#backend-installation">Backend Installation</a></li>
        <li><a href="#frontend-installation">Frontend Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#project-documents">Project Documents</a></li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#promotional-videos">Promotional Videos</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

<a href="https://www.figma.com/design/vXN8MF0XHdS9KF5yII9ag2/Steak?node-id=0-1&t=a8jZ7VVYewacFEQS-1" target="_blank">
    <p align="center">
    <img src="/dashboard.png" alt="dashboard" width="500">
    </p>
</a>

Steak is a web-based tool, designed to simplify money management. Upon signing up, users can input their bank balances. Money can be assigned to "Jars", which act as savings pots for any specified purpose. A budgeting page is also present, allowing the user to allocate their monthly income, displaying the incoming/outgoings as a budgeting sheet and a corresponding pie chart. Balances can be tracked over time, and are graphically realised for ease of interpretation. Payment transactions can be tracked, with data exports for all the aforemented available for download at any time. All data is also summarised on the dashboard, accompanied by a breaking financial news portal for those who are interested.

<!-- FEATURES -->
### Features

- Secure Login & Signup
- SQLite External Credential and Data Storage
- GCP or Locally Hosted
- Mock Banking Integration
- "Money Jar" Allocation
- Integrated Budgeting App
- Transaction Tracking
- Dynamic Graphing
- Live News Feed
- Data Export
- Product Advertisement Carousel

### Built With

- [Google Cloud Platform](https://cloud.google.com)
- [PostgreSQL](https://www.postgresql.org/)
- [SQLite](https://www.sqlite.org/)
- [Python](https://www.python.org/)
- [Javascript](https://www.javascript.com/)
- [React](https://react.dev/)

<!-- GETTING STARTED -->
## Getting Started

Please follow the below step-by-step instructions to run the project:

### Local Prerequisites

- [Project Repo Clone](https://github.com/UniOfGreenwich/elee1149-coursework--steak)  
- [Python](https://www.python.org/)  
- [NodeJS](https://nodejs.org/en)

### Backend Installation

1. Check Python Version: Open the command prompt and use the command python --version to verify that Python is installed correctly.
2. Install Packages: Use the command python -m pip install flask flask_sqlalchemy flask_cors werkzeug to install the necessary Python packages. A link to a list of required packages was provided in the chat (though the contents of that link aren't specified in these notes).
3. Navigate to the Correct Directory: Use the command cd elee1149-coursework--steak\steakinc-web-app\steakinc-web-app\python_backend to navigate to the Python backend folder.
4. Run the GCP Script: Use the command python gcp_app.py to start the application and verify functionality.
5. If GCP is Expired, Run the Local Script: Use the command python local_app.py to start the application and verify functionality.

### Frontend Installation

1. Verify Node.js and npm Installations: Open the command prompt and use the following commands to check the versions and confirm installation:  
  
    - node -v  
    - npm -v

3. Navigate to the Project Folder: Use the cd command in the command prompt to navigate to the root directory of the project.
4. Run the Development Server: Execute the command npm run dev to start the development server.

<!-- ROADMAP -->
## Roadmap

Implemented Project Functionality:

- [ ] User Login: Allows existing users to access their accounts.
- [ ] User Registration: Enables new users to create accounts.
- [ ] User Logout: Enabling a different user to log in.
- [ ] Account Security: Security question prompts upon signup.
- [ ] Transaction History (View & Add):  View past transactions and add new ones.
- [ ] Budgeting Tools: Create and manage budgets for different categories.
- [ ] Savings Goals ("Money Jars"): Set and track progress towards financial goals.
- [ ] Asset Tracking (Total Value):  View the total value of all assets.
- [ ] Financial News Feed: Display relevant financial news articles.
- [ ] Data Export: Allows users to download their data.
- [ ] Forgot Password Functionality: Reset password if forgotten.
- [ ] Net Worth Tracking: Calculate and track net worth over time.
- [ ] Advertising Material

Cancelled Project Functionality:

- [ ] Account Linking (Bank Accounts): Connect bank accounts for automatic transaction import.
- [ ] Blog/Educational Content: Provide financial advice and educational resources.
- [ ] Achievement Badges (Gamification): Award badges for reaching financial milestones.

<!-- PROJECT DOCUMENTS -->
## Project Documents

- [Sprint Planning](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/Sprint%20Planning)  
- [Standup Transcripts](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/Standup%20Notes)  
- [System Modelling](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/System%20Modelling)
- [Agile Development Plan](Docs/Agile_Development_Plan.md)
- [Requirements Definition](Docs/Requirements.md)  
- [Unit Tests](https://github.com/UniOfGreenwich/elee1149-coursework--steak/tree/main/Docs/Unit%20Tests)  
- [Team Kanban](https://github.com/orgs/UniOfGreenwich/projects/32)  
- [Team Roadmap](https://github.com/orgs/UniOfGreenwich/projects/32/views/4)

<!-- CONTRIBUTORS -->
## Contributors

- Harrison Cox - hc5167i@gre.ac.uk
- Gareth Massenhove - gm9918h@gre.ac.uk
- Lewis Bray - lb3011x@gre.ac.uk
- Jack Buchanan - jb6522g@gre.ac.uk

<!-- PROMOTIONAL VIDEO -->
## Promotional Videos


<img src="/SteakScreenshot.png" alt="screenshot" width=50%>

Promotional Video 1 - [Link](https://www.youtube.com/watch?v=JbbvTQxuzr0)

Promotional Video 2 - [Link](https://shattereddisk.github.io/rickroll/rickroll.mp4)
