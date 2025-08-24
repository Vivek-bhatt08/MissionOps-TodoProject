const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    // ENSURE THESE TWO FIELDS ARE HERE
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', TodoSchema);