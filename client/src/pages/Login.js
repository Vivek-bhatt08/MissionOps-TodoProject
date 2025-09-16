import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // ✅ loading state
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // ✅ start loading
        try {
            const res = await axios.post(
                'https://missionops.onrender.com/api/auth/login',
                { username, password }
            );

            login(res.data.token, res.data.user || { username });
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Invalid credentials');
        } finally {
            setLoading(false); // ✅ stop loading
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
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading} // disable when loading
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading} // disable when loading
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"} {/* ✅ show text change */}
                </button>
            </form>
            {loading && <p style={{ textAlign: "center", marginTop: "10px" }}>Please wait...</p>}
            <div className="auth-footer">
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;
