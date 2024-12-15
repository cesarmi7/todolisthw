import mongoose from 'mongoose';

// Define Task Schema
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Task description is required'], // Ensures description is mandatory
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Task Model
const Task = mongoose.model('Task', taskSchema);

export default Task;
