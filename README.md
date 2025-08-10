# Hostel Allotment System - Frontend

This is the React client-side application for the Hostel Allotment System. It provides a modern, responsive user interface for both students and administrators to interact with the allotment process.

**Live Demo:** [https://hostel-allotment-frontend-22bcs004.vercel.app/](https://hostel-allotment-frontend-22bcs004.vercel.app/) 
---

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