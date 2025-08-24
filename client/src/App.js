import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            {/* This new div is the main container for the background */}
            <div className="app-background">
                <div className="shape1"></div>
                <div className="shape2"></div>
                <Router>
                    <div className="container">
                        <Routes>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;