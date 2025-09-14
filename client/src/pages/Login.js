import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://missionops.onrender.com/api/auth/login', { username, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response.data);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>Welcome Back!</h2>
                <p>Please log in to access your tasks.</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="auth-footer">
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;
