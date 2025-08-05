import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to stay logged in on refresh
    const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || null);
    const [adminInfo, setAdminInfo] = useState(() => JSON.parse(localStorage.getItem('adminInfo')) || null);

    const loginUser = async (formData) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
        toast.success('Login successful!');
        return data;
    };

    const logoutUser = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        toast.info('You have been logged out.');
    };

    const loginAdmin = async (formData) => {
        const { data } = await axios.post('http://localhost:5000/api/admin/login', formData);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        setAdminInfo(data);
        toast.success('Admin login successful!');
        return data;
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminInfo');
        setAdminInfo(null);
    };

    const value = {
        userInfo,
        adminInfo,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
    return useContext(AuthContext);
};