import React from "react";
import { FaRegCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import "./TodoItem.css";
import { MdDeleteOutline } from "react-icons/md";

const TodoItem = ({ task, index, onToggle, onDelete }) => {
  return (
    <tr
      className={`todo-item ${
        task.isApiTask ? "todo-item--api" : "todo-item--manual"
      }`}
    >
      <td className="todo-item__index">{index}</td>{" "}
      {/* Display the task number */}
      <td className="todo-item__status" onClick={() => onToggle(task.id)}>
        {task.completed ? <FaCircleCheck /> : <FaRegCircle />}
      </td>
      <td
        className={`todo-item__text ${
          task.completed ? "todo-item__text--completed" : ""
        }`}
      >
        {task.text}
      </td>
      <td className="todo-item__priority">{task.priority}</td>
      <td className="todo-item__actions">
        <button onClick={() => onDelete(task.id)}>
          <MdDeleteOutline size={25} />
        </button>
      </td>
    </tr>
  );
};

export default TodoItem;
