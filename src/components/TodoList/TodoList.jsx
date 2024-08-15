import React, { useEffect, useState } from "react";
import TodoItem from "../TodoItem/TodoItem";
import Modal from "../Modal/Modal";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [apiTaskCount, setApiTaskCount] = useState(5);
  const [filter, setFilter] = useState("all");

  /*
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("tasks");
    }
  }, [tasks]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    } else {
      setTasks([]);
    }
  }, []);
*/

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      setTasks([]); // Ensure tasks is at least an empty array
    }
  }, []);

  // Save tasks to localStorage whenever tasks array changes
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  const addTask = () => {
    if (newTaskText.trim() === "") {
      setModalMessage("Task title is required.");
      setShowModal(true);
      return;
    }

    const newTask = {
      id: generateUniqueId(),
      text: newTaskText,
      priority: priority,
      completed: false,
      isApiTask: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskText("");
  };

  const fetchTasksFromApi = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/todos`);
      const data = await response.json();

      const shuffledTasks = data.todos
        .sort(() => 0.5 - Math.random())
        .slice(0, apiTaskCount);

      const fetchedTasks = shuffledTasks.map((task) => ({
        id: generateUniqueId(),
        text: task.todo,
        completed: task.completed,
        priority: "Low",
        isApiTask: true,
      }));

      setTasks((prevTasks) => [...prevTasks, ...fetchedTasks]);

      setModalMessage(`You fetched ${fetchedTasks.length} tasks from the API.`);
      setShowModal(true);
    } catch (error) {
      setModalMessage("An error occurred while fetching tasks from the API.");
      setShowModal(true);
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const deleteManualTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.isApiTask));
  };

  const deleteApiTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.isApiTask));
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorities = { Low: 1, Medium: 2, High: 3 };
    return priorities[a.priority] - priorities[b.priority];
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="todo-list">
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Notification"
        message={modalMessage}
      />
      <div className="todo-list__header">
        {totalTasks > 0
          ? `Completed Tasks: ${completedTasks} of ${totalTasks}`
          : "There are no added tasks yet"}
      </div>

      <div className="todo-list__input">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="todo-list__fetch-api">
        <label htmlFor="task-count-slider">
          Select Number of Tasks: {apiTaskCount}
        </label>
        <input
          id="task-count-slider"
          type="range"
          min="1"
          max="30"
          value={apiTaskCount}
          onChange={(e) => setApiTaskCount(Number(e.target.value))}
          className="todo-list__slider"
        />
        <button onClick={fetchTasksFromApi} className="todo-list__fetch-button">
          Fetch Tasks from API
        </button>
      </div>

      <div className="todo-list__filter">
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      <div className="todo-list__actions">
        <button onClick={deleteAllTasks}>Delete All Tasks</button>
        <button onClick={deleteManualTasks}>Delete Manual Tasks</button>
        <button onClick={deleteApiTasks}>Delete API Tasks</button>
      </div>

      <table className="todo-list__table">
        <thead>
          <tr>
            <th>#</th>
            <th>Completed</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TodoItem
                key={task.id}
                task={task}
                index={index + 1}
                onToggle={toggleTaskCompletion}
                onDelete={deleteTask}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="todo-list__no-tasks">
                There are no tasks to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
