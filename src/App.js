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
  }, []); //The fetched tasks are stored in the tasks state.

  // Render tasks and subtasks
  const renderTasks = (taskList) => {
    return taskList.map((task) => (  //map Function: Iterates over the list of tasks and renders each as a list item.
      <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <label className={`form-check-label ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
            {task.title}
          </label>
        </div>
        {task.subtasks && task.subtasks.length > 0 && (  ////Subtasks: If a task contains subtasks, they are rendered as a nested list.
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
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h1>To-Do List</h1>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {tasks.length > 0 ? renderTasks(tasks) : <p className="text-center">No tasks available!</p>}
          </ul>
        </div>
        <div className="card-footer text-muted text-center">
          <small>Manage your tasks efficiently!</small>
        </div>
      </div>
    </div>
  );
};

export default App;