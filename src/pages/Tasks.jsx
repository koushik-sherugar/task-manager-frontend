import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useUserAuth } from "../context/userAuthContext";
import { ButtonsColoured } from "../components/widgets/Buttons";
import TaskDetailModal from "../components/widgets/TaskDetailModal";
import { deleteTask, getTasks } from "../functions/taskFunctions";
import AddTaskModal from "../components/widgets/AddTaskModal";
import EditTaskModal from "../components/widgets/EditTaskModal";
import TaskSearchBar from "../components/TaskSearchBar";
import { userTasksRefreshStore } from "../ZustandStores/TasksStore";

const Tasks = () => {
  const { user } = useUserAuth();
  const { userTasksRefresh, setUserTasksRefresh } = userTasksRefreshStore();

  // Local state
  const [tasks, setTasks] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log("source, destination  ------->", source, destination);
    // Dropped outside the list
    if (!destination) return;

    const sourceCol = tasks[source.droppableId];
    const destCol = tasks[destination.droppableId];

    // Reordering within the same list
    if (source.droppableId === destination.droppableId) {
      const [reorderedItem] = sourceCol.splice(source.index, 1);
      destCol.splice(destination.index, 0, reorderedItem);

      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: destCol,
      }));
    } else {
      // Moving between lists
      const [movedTask] = sourceCol.splice(source.index, 1);
      movedTask.status =
        destination.droppableId.charAt(0).toUpperCase() +
        destination.droppableId.slice(1);
      destCol.splice(destination.index, 0, movedTask);

      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol,
      }));
    }
    // Update task status in DB
    // axios.put(`/api/tasks/${movedTask._id}`, movedTask);
  };

  // Add the task
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setEditTaskModalOpen(true);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setEditTaskModalOpen(false);
    setTaskToEdit(null);
  };

  // View the task details
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const taskList = await getTasks(user?.uid);

      // Categorize tasks based on their status
      const categorizedTasks = {
        todo: taskList.filter((task) => task.status === "To Do"),
        inProgress: taskList.filter((task) => task.status === "In Progress"),
        done: taskList.filter((task) => task.status === "Done"),
      };

      setTasks(categorizedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      try {
        console.log("Attempting to delete task with ID:", taskId);

        // Call the deleteTask function to delete the task from the backend
        await deleteTask(user?.uid, taskId);

        setUserTasksRefresh(!userTasksRefresh);

        alert("Task deleted successfully");
      } catch (error) {
        console.error("Failed to delete task:", error);
        // alert("Failed to delete task. Please try again.");
      }
    } else {
      console.log("Task deletion was cancelled by the user.");
    }
  };

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [user?.uid, userTasksRefresh]);

  return (
    <div className="p-3 ">
      <button
        className="px-3 py-1 my-2 text-white rounded-md bg-accentblue "
        onClick={() => {
          setAddTaskModalOpen(true);
        }}
      >
        Add task
      </button>
      <TaskSearchBar />

      <div className="flex flex-col justify-evenly md:flex-row">
        <DragDropContext onDragEnd={onDragEnd}>
          {["todo", "inProgress", "done"]?.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  {...provided?.droppableProps}
                  ref={provided?.innerRef}
                  className="w-2/3 p-2 rounded-md shadow-md md:w-1/3"
                >
                  <h2 className="p-2 text-center text-white bg-accentblue">
                    {col === "todo"
                      ? "To Do"
                      : col === "inProgress"
                      ? "In Progress"
                      : "Done"}
                  </h2>
                  {tasks[col]?.map((task, index) => (
                    <Draggable
                      key={task._id + index}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 my-2 rounded-md shadow-sm bg-blueLight"
                          style={{ ...provided.draggableProps.style }}
                        >
                          <h4>{task?.title}</h4>
                          <p>{task?.description}</p>
                          <div className="flex justify-end gap-1">
                            <ButtonsColoured
                              title={"Delete"}
                              clickAction={() => handleDeleteTask(task._id)}
                              color={"redMid"}
                            />
                            <ButtonsColoured
                              title={"Edit"}
                              clickAction={() => openEditModal(task)}
                              color={"blueMid"}
                            />
                            <ButtonsColoured
                              title={"View Details"}
                              clickAction={() => handleViewDetails(task)}
                              color={"accentblue"}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
        {/* Modal to View Details */}
        {selectedTask && (
          <TaskDetailModal
            selectedTask={selectedTask}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
        )}

        {/* AddTask Modal */}
        <AddTaskModal
          isModalOpen={addTaskModalOpen}
          closeModal={() => {
            setAddTaskModalOpen(false);
          }}
        />

        {/* Edit Task Modal */}
        <EditTaskModal
          isModalOpen={editTaskModalOpen}
          closeModal={closeEditModal}
          taskToEdit={taskToEdit}
        />
      </div>
    </div>
  );
};

export default Tasks;
