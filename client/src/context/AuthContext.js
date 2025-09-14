import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Helper function to set the auth token for all axios requests
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export const AuthProvider = ({ children }) => {
    // Initial state mein token localStorage se padhein
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [isLoading, setIsLoading] = useState(true); // Page load par loading state

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
            setAuthToken(tokenFromStorage);
            setIsAuthenticated(true);
        }
        setIsLoading(false); // Initial check poora hua
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken); // Token ko localStorage mein save karein
        setToken(newToken);
        setAuthToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token'); // Token ko localStorage se hatayein
        setToken(null);
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    // Agar initial load ho raha hai, toh loading screen dikhayein (optional but good UX)
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
