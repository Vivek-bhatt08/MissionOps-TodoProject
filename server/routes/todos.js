const express = require('express');
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');
const router = express.Router();

// Get all todos for a user
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create a todo
router.post('/', auth, async (req, res) => {
    const { text, priority, dueDate } = req.body;
    try {
        const newTodo = new Todo({
            user: req.user.id,
            text,
            priority,
            dueDate
        });
        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Todo not found' });
        if (todo.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        todo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(todo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// Delete a todo
router.delete('/:id', auth, async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ msg: 'Todo not found' });
        if (todo.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // THE FIX IS HERE:
        await Todo.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;