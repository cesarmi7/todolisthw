import React, { useState } from "react";

export default function Todo({ todo, deleteTask, updateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(todo.description);

  const handleUpdate = () => {
    updateTask(todo._id, updatedTask);
    setIsEditing(false);
  };

  return (
    <div className="todo">
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <span>{todo.description}</span>
          <div>
            <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            <button onClick={() => deleteTask(todo._id)}>🗑️ Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
