import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Spinner ke liye state
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Spinner chalu karein

        try {
            // Yahan purana, local path use kiya gaya hai
            const res = await axios.post('/api/auth/register', { username, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response ? err.response.data : "Server se response nahi aaya");
            alert('User already exists or another registration error occurred.');
        } finally {
            setIsLoading(false); // Spinner band karein
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>Create Your Account</h2>
                <p>Get started with MissionOps today.</p>
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : 'Create Account'}
                </button>
            </form>
            <div className="auth-footer">
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </div>
        </div>
    );
};

export default Register;

