import React from "react";
import Modal from "react-modal";
import { ButtonsColoured } from "./Buttons";

const TaskDetailModal = ({ selectedTask, isModalOpen, closeModal }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Task Details"
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <h2>{selectedTask.title}</h2>
      <p>{selectedTask.description}</p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(selectedTask.createdAt).toLocaleString()}
      </p>
      <ButtonsColoured
        title="Close"
        color="accentblue"
        clickAction={closeModal}
      />
    </Modal>
  );
};

export default TaskDetailModal;
