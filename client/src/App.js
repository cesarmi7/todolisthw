import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_URL = "https://assignment-5-backend-485d.onrender.com/api/tasks";
  const [tasks, setTasks] = useState([]); // State for tasks
  const [taskInput, setTaskInput] = useState(""); // Input state
  const [editIndex, setEditIndex] = useState(null); // Edit task state

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  // Add or update a task
  const addTask = async () => {
    if (taskInput.trim() === "") return; // Prevent empty tasks

    if (editIndex) {
      // Update the task (local or backend)
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editIndex ? { ...task, description: taskInput } : task
        )
      );
      try {
        await axios.put(`${API_URL}/${editIndex}`, { description: taskInput });
      } catch (err) {
        console.error("Error updating task:", err.message);
      }
      setEditIndex(null); // Clear edit state
    } else {
      // Add a new task locally first
      const newTask = { _id: Date.now(), description: taskInput, isLocal: true };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      try {
        const res = await axios.post(API_URL, { description: taskInput });
        const savedTask = res.data;

        // Replace local task with backend-saved task
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === newTask._id ? { ...savedTask, isLocal: false } : task
          )
        );
      } catch (err) {
        console.error("Error saving task:", err.message);
      }
    }
    setTaskInput(""); // Clear input field
  };

  // Delete a task
  const deleteTask = async (id, isLocal) => {
    // Delete locally added tasks
    if (isLocal) {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      return;
    }
    // Delete from backend
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  // Edit a task
  const editTask = (id, description) => {
    setTaskInput(description);
    setEditIndex(id);
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      {/* API Endpoint Buttons */}
      <div className="api-endpoints">
        <h2>API Endpoints</h2>
        <a href={API_URL} target="_blank" rel="noopener noreferrer">
          <button className="api-btn">GET All To-Dos</button>
        </a>
        <a href={API_URL} target="_blank" rel="noopener noreferrer">
          <button className="api-btn">POST Create To-Do</button>
        </a>
        <a href={`${API_URL}/:id`} target="_blank" rel="noopener noreferrer">
          <button className="api-btn">PUT Update To-Do</button>
        </a>
        <a href={`${API_URL}/:id`} target="_blank" rel="noopener noreferrer">
          <button className="api-btn">DELETE To-Do</button>
        </a>
      </div>

      <h1 className="title">🌸 To-Do List 🌸</h1>

      {/* Input Field */}
      <div className="task-input-container">
        <input
          type="text"
          className="task-input"
          placeholder="Enter a task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          {editIndex ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <span className="task-text">{task.description}</span>
            <div className="task-buttons">
              <button
                className="edit-btn"
                onClick={() => editTask(task._id, task.description)}
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task._id, task.isLocal)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
