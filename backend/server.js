const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/taskModel'); // Import Task model

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection String
const dbURI = 'mongodb+srv://cesariglezias:S0fmXpW1YLLFqcmo@cluster0.8lmig.mongodb.net/todolisthw?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Routes
// GET - Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
});

// POST - Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    const newTask = new Task({ description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add task', error: err.message });
  }
});

// PUT - Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { description },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// DELETE - Remove a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
