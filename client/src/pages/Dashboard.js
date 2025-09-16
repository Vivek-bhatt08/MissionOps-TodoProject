import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define the live backend URL
const backendUrl = 'https://missionops.onrender.com';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [filter, setFilter] = useState('All');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // UPDATED: Use the full backend URL
        axios.get(`${backendUrl}/api/todos`)
            .then(res => setTodos(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if(!text.trim()) return;
        try {
            const newTodo = { text, priority, dueDate: dueDate || null };
            // UPDATED: Use the full backend URL
            const res = await axios.post(`${backendUrl}/api/todos`, newTodo);
            setTodos([res.data, ...todos]);
            setText('');
            setPriority('Medium');
            setDueDate('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            // UPDATED: Use the full backend URL
            const res = await axios.put(`${backendUrl}/api/todos/${id}`, { completed: !completed });
            setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            // UPDATED: Use the full backend URL
            await axios.delete(`${backendUrl}/api/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error("Error deleting task:", err);
            alert("Could not delete the task.");
        }
    };

    const handleStartEdit = (todo) => {
        setEditingId(todo._id);
        setEditingText(todo.text);
    };
    
    const handleSaveEdit = async (id) => {
        try {
            // UPDATED: Use the full backend URL
            const res = await axios.put(`${backendUrl}/api/todos/${id}`, { text: editingText });
            setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
            setEditingId(null);
            setEditingText('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'Active') return !todo.completed;
        if (filter === 'Completed') return todo.completed;
        return true;
    });

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>MissionOps</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>
            <p>COMMANDO LET'S ADD SOME MISSION'S</p>
            <form onSubmit={handleAddTodo} className="todo-form">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a new task..."
                    className="task-input"
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button type="submit">Add Task</button>
            </form>

            <div className="filter-buttons">
                <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
                <button onClick={() => setFilter('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
                <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
            </div>

            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        {editingId === todo._id ? (
                            <div className="edit-view">
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="edit-input"
                                />
                                <button onClick={() => handleSaveEdit(todo._id)} className="save-btn">Save</button>
                                <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                            </div>
                        ) : (
                            <>
                                <div className="task-details" onClick={() => toggleComplete(todo._id, todo.completed)}>
                                    <span className="task-text">{todo.text}</span>
                                    <div className="meta-data">
                                        <span className={`priority ${todo.priority.toLowerCase()}`}>{todo.priority}</span>
                                        {todo.dueDate && (
                                            <span className="due-date">
                                                Due: {new Date(todo.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button onClick={(e) => { e.stopPropagation(); handleStartEdit(todo); }} className="icon-btn edit-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(todo._id); }} className="icon-btn delete-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;