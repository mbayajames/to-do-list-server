import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from db.json using Axios
  useEffect(() => {
    axios
      .get("http://localhost:4000/tasks")
      .then((response) => setTasks(response.data.tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Render tasks and subtasks
  const renderTasks = (taskList) => {
    return taskList.map((task) => (
      <li key={task.id} className="list-group-item">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <label className={`form-check-label ${task.completed ? 'text-decoration-line-through' : ''}`}>
            {task.title}
          </label>
        </div>
        {task.subtasks && task.subtasks.length > 0 && (
          <ul className="list-group ms-4 mt-2">
            {renderTasks(task.subtasks)}
          </ul>
        )}
      </li>
    ));
  };

  // Toggle completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : {
              ...task,
              subtasks: task.subtasks
                ? task.subtasks.map((subtask) =>
                    subtask.id === taskId
                      ? { ...subtask, completed: !subtask.completed }
                      : subtask
                  )
                : task.subtasks,
            }
      )
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do List</h1>
      <ul className="list-group">
        {renderTasks(tasks)}
      </ul>
    </div>
  );
};

export default App;