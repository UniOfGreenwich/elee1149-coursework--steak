# Meeting Notes: Runtime Components and Login Page Review

**Date:** 17/01/2025

**Attendees:** Jack, Harrison

---

### Agenda

1. Identify and note runtime installation requirements.
2. Review login page.
3. Discuss database implementation.
4. File structure review for Python backend.

---

### Discussion Points

#### Running the Code

- **Participants:** Harrison and Jack
- **Key Points:**
  - Harrison has written Python code for database creation and user accounts.
  - Ensured Seb can run the code by documenting the steps.
  - Cloned the project repository and confirmed the use of Jack's feature branch.
  - Jack instructed running `npm run dev` for the development server setup.
  - Node.js installation was required for Harrison; guided download and installation steps.
  - Verified Node.js and npm installations with version commands.

#### Setting Up Node.js

- **Participants:** Harrison and Jack
- **Key Points:**
  - Downloaded Node.js MSI package for Windows.
  - Installed Node.js with necessary tools.
  - Verified installations using `node -v` and `npm -v`.

#### Running npm Commands

- **Participants:** Harrison and Jack
- **Key Points:**
  - Faced initial issues running `npm run dev`.
  - Successfully started the development server after navigating to the project folder.

#### Reviewing the Frontend

- **Participants:** Jack and Harrison
- **Key Points:**
  - Reviewed frontend design, focusing on responsiveness and layout.
  - Suggested improvements: moving title and logo to a navigation bar, making carousel full width and height.
  - Discussed removing 'forgot password' link from the main page.

#### Database Design

- **Participants:** Harrison and Jack
- **Key Points:**
  - Shared database design and Python script for table creation and user handling.
  - Discussed placing backend code in a new 'backend' folder.
  - Planned new branches for backend and carousel updates.

---

### Decisions Made

- **Decision 1:** Remove the 'forgot password' link from the main page and incorporate it into the login process.
- **Decision 2:** Create a new 'backend' folder for Python code placement outside the 'source' directory.

---

### Current Steps for running react

- **Step 1:** Download and instal Node.js from https://nodejs.org/en/download/ onto machine
- **Step 2:** Clone repository and in git bash navigate to the repository and to the folder path "steakinc/steakinc-web-app/steakinc-web-app"
- **Step 3:** Npm install
- **Step 4:** Npm run dev

---

## Follow-up Tasks

1. **Node.js Installation:**
   - Document the steps for installing Node.js and running the project for Seb. *(Harrison)*

2. **Backend Folder Creation:**
   - Create a new branch and add the Python backend code in a new folder named 'backend' outside the 'source' directory. *(Harrison)*

3. **Carousel Update:**
   - Create a new branch to update the carousel with full JavaScript for better functionality and customizability. *(Jack)*

4. **Navbar Design Discussion:**
   - Discuss the design suggestions for the desktop view, including moving the high steaks title and logo into a navbar with login and sign-up options, during the stand-up meeting. *(Jack, Harrison)*
