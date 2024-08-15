import React from "react";
import "./Modal.css";

const Modal = ({ show, onClose, title, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal__title">{title}</h2>
        <p className="modal__message">{message}</p>
        <button onClick={onClose} className="modal__close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
