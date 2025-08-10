# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Hostel Allotment System - Frontend

This is the React client-side application for the Hostel Allotment System. It provides a modern, responsive user interface for both students and administrators to interact with the allotment process.

**Live Demo:** [https://hostel-allotment-frontend.vercel.app](https://hostel-allotment-frontend.vercel.app) *(Replace with your actual Vercel link)*

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