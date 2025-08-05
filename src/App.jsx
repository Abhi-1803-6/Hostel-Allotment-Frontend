import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import the hook
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

function App() {
  const { userInfo, adminInfo } = useAuth(); // Use the context

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        {!userInfo && !adminInfo && <Link to="/login" style={{ marginLeft: '10px' }}>Student Login</Link>}
        {!userInfo && !adminInfo && <Link to="/register" style={{ marginLeft: '10px' }}>Register</Link>}
        {userInfo && <Link to="/dashboard" style={{ marginLeft: '10px' }}>Dashboard</Link>}
        {adminInfo && <Link to="/admin/dashboard" style={{ marginLeft: '10px' }}>Admin Dashboard</Link>}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!userInfo ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!userInfo ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/admin-login" element={!adminInfo ? <AdminLoginPage /> : <Navigate to="/admin/dashboard" />} />
          <Route path="/dashboard" element={userInfo ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/admin/dashboard" element={adminInfo ? <AdminDashboardPage /> : <Navigate to="/admin-login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;