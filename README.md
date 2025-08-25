# Hostel Allotment System - Frontend

This is the React client-side application for the Hostel Allotment System. It provides a modern, responsive user interface for both students and administrators to interact with the allotment process.

## Live Demo & Testing Guide

**Live Demo:** [https://hostel-allotment-frontend-22bcs004.vercel.app/](https://hostel-allotment-frontend-22bcs004.vercel.app/) 
---
The application has been pre-seeded with a full set of demo data, including an admin, a rank list, available rooms, and 10 students who have already formed three complete groups. This allows for immediate testing of the entire live allotment workflow.

### Demo Credentials

You can log in as any of the following users. For the best experience, it is recommended to log in as the **Admin** and at least one **Group Leader** in separate browser windows or profiles (e.g., one in Chrome, one in Firefox).

| Role | Identifier (Email / Roll Number) | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `adminpass123` | Manages the system. |
| **Group 1 Leader(A)** | `22BCS001` *(or their roll number)* | `A`| **Rank 1** |
| **Group 2 Leader(D)** | `22BCS004` *(or their roll number)* | `D`| Rank 4 |
| **Group 3 Leader(G)** | `22BCS007` *(or their roll number)* | `G`| Rank 7 |

*(Note: Other student accounts exist to fill the groups, but these are the key accounts for testing the allotment flow.)*

### Recommended Testing Flow

To see the full power of the application, please follow these steps:

1.  **Log in as the Admin.** Use the credentials above.
2.  On the Admin Dashboard, use the **"Show All Groups"** button to view the three pre-formed student groups.
3.  In the "Allotment Control" section, click **"1. Lock All Groups"**.
4.  After locking the groups, click **"2. Start Allotment Process"**.
5.  **Open a new browser window** (or a different browser like Firefox) and log in as the **Group 1 Leader (Student A)**.
6.  You should see their dashboard update in real-time to show the room selection panel and a 5-minute countdown timer. **Select a room**.
7.  Once a room is selected, the turn will automatically pass to the next leader in the queue (Group 2 Leader, Student D, refresh the student's dashboard).
8.  When you are finished, please return to the Admin Dashboard and click the **"Reset Demo State"** button. This will clean up the data for the next visitor.

### Key Features

* **Separate User Dashboards:** Dedicated and protected dashboards for Students and Administrators.
* **Interactive Group Management:** Students can create, invite, join, and leave groups in real-time.
* **Live Allotment UI:** A dynamic interface for group leaders to select rooms during their timed turn, featuring a live countdown timer.
* **Professional UI/UX:** Built with Material-UI (MUI) for a modern look and feel, and `react-toastify` for non-disruptive notifications.
* **Global State Management:** Uses React's Context API to manage authentication state for a seamless single-page application experience.

---

### Tech Stack

* **Framework/Library:** React, Vite
* **UI:** Material-UI (MUI)
* **Routing:** React Router DOM
* **State Management:** React Context API
* **Real-time:** Socket.IO Client
* **Deployment:** Vercel

---

### Getting Started

#### Prerequisites

* Node.js (v18 or later)

#### Setup and Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Abhi-1803-6/Hostel-Allotment-Frontend.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Hostel-Allotment-Frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env.development` file in the root and add the backend API URL:
    ```
    VITE_API_URL=http://localhost:5000
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:5173`.