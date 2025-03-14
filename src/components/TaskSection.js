import React, { useRef } from "react";
import {
  addTask as addTaskService,
  editTask as editTaskService,
  toggleTaskCompletion as toggleTaskCompletionService,
  deleteTask as deleteTaskService,
} from "./FirebaseTasks";
import {
  handleAddColorChange,
  handleEditColorChange,
  createPriorityMap,
} from "./PriorityUtils";

const TaskSection = ({
  user,
  languageData,
  tasks,
  newTask,
  setNewTask,
  addPriorityColor,
  setAddPriorityColor,
  addPriorityText,
  setAddPriorityText,
  addPriorityFireColor,
  setAddPriorityFireColor,
  editTaskId,
  setEditTaskId,
  editTaskText,
  setEditTaskText,
  editPriorityColor,
  setEditPriorityColor,
  editPriorityText,
  setEditPriorityText,
  editPriorityFireColor,
  setEditPriorityFireColor,
  isLoading,
  toggleExpand,
  expandedTasks,
  setTasks,
  tasksArray,
}) => {
  const priorityMap = createPriorityMap(languageData);
  const touchTimerRef = useRef(null);

  const resetTaskForm = () => {
    setNewTask("");
    setAddPriorityText("2");
    setAddPriorityColor("warning");
    setAddPriorityFireColor("rgb(255, 193, 7)");
  };

  // Delete Task
  const handleDelete = async (taskId) => {
    try {
      await deleteTaskService(user, taskId); 
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); 
      console.log(`✅ The task has been successfully deleted: ${taskId}`);
    } catch (error) {
      console.error("❌ Error deleting the task:", error.message || error);
    }
  };

  return (
    <div className="main-tasks">
      <div className="title">{languageData?.allTasks}</div>
      <p className="d-inline-flex gap-1">
        <button
          className="add-task"
          data-bs-toggle="collapse"
          data-bs-target="#task"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <i className="fa-solid fa-plus"></i> {languageData?.addTask}
        </button>
      </p>

      <div className="tasks">
        <div className="collapse" id="task">
          <div className="add-input">
            <input
              type="text"
              onChange={(e) => setNewTask(e.target.value)}
              value={newTask}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                addTaskService(
                  user,
                  newTask,
                  addPriorityText,
                  addPriorityFireColor,
                  setTasks,
                  resetTaskForm
                )
              }
              placeholder={languageData?.writeNewTask}
            />
            <div className="dropdown">
              <button
                type="button"
                className={`btn btn-${addPriorityColor} pbtn dropdown-toggle`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {languageData?.priority}
              </button>
              <ul className="dropdown-menu p-menu" id="add-dropdown-menu">
                <li
                  className="dropdown-item p-red"
                  data-value="1"
                  onClick={(e) =>
                    handleAddColorChange(
                      e,
                      priorityMap,
                      setAddPriorityColor,
                      setAddPriorityFireColor,
                      setAddPriorityText
                    )
                  }
                >
                  {languageData?.high}
                </li>
                <li
                  className="dropdown-item p-yellow"
                  data-value="2"
                  onClick={(e) =>
                    handleAddColorChange(
                      e,
                      priorityMap,
                      setAddPriorityColor,
                      setAddPriorityFireColor,
                      setAddPriorityText
                    )
                  }
                >
                  {languageData?.medium}
                </li>
                <li
                  className="dropdown-item p-blue"
                  data-value="3"
                  onClick={(e) =>
                    handleAddColorChange(
                      e,
                      priorityMap,
                      setAddPriorityColor,
                      setAddPriorityFireColor,
                      setAddPriorityText
                    )
                  }
                >
                  {languageData?.low}
                </li>
              </ul>
            </div>
            <button
              className="add-btn"
              onClick={() =>
                addTaskService(
                  user,
                  newTask,
                  addPriorityText,
                  addPriorityFireColor,
                  setTasks,
                  resetTaskForm
                )
              }
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        <ul className="prev-tasks">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className="placeholder-glow">
                  <span className="placeholder col-12"></span>
                </li>
              ))
            : tasks.map((task) => (
                <li key={task.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTaskCompletionService(
                        user,
                        task.id,
                        task.completed,
                        setTasks,
                        tasksArray,
                        () => {}
                      )
                    }
                  />
                  {editTaskId === task.id ? (
                    <div className="dropdown">
                      <button
                        type="button"
                        className={`btn btn-${
                          editPriorityColor || "warning"
                        } pbtn dropdown-toggle`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {languageData?.priority}
                      </button>
                      <ul
                        className="dropdown-menu p-menu"
                        id="edit-dropdown-menu"
                      >
                        <li
                          className="dropdown-item p-red"
                          data-value="1"
                          onClick={(e) =>
                            handleEditColorChange(
                              e,
                              priorityMap,
                              setEditPriorityColor,
                              setEditPriorityFireColor,
                              setEditPriorityText
                            )
                          }
                        >
                          {languageData?.high}
                        </li>
                        <li
                          className="dropdown-item p-yellow"
                          data-value="2"
                          onClick={(e) =>
                            handleEditColorChange(
                              e,
                              priorityMap,
                              setEditPriorityColor,
                              setEditPriorityFireColor,
                              setEditPriorityText
                            )
                          }
                        >
                          {languageData?.medium}
                        </li>
                        <li
                          className="dropdown-item p-blue"
                          data-value="3"
                          onClick={(e) =>
                            handleEditColorChange(
                              e,
                              priorityMap,
                              setEditPriorityColor,
                              setEditPriorityFireColor,
                              setEditPriorityText
                            )
                          }
                        >
                          {languageData?.low}
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div
                      className="p-div"
                      style={{ backgroundColor: task.priorityColor }}
                      title={
                        task.priority === "1"
                          ? languageData?.high
                          : task.priority === "2"
                          ? languageData?.medium
                          : languageData?.low
                      }
                    ></div>
                  )}
                  {editTaskId === task.id ? (
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                      onBlur={() => {
                        if (
                          editTaskText &&
                          typeof editTaskText === "string" &&
                          editTaskText.trim() !== ""
                        ) {
                          editTaskService(
                            user,
                            task.id,
                            editTaskText,
                            editPriorityText,
                            editPriorityFireColor,
                            setTasks,
                            () => setEditTaskId(null)
                          );
                        } else {
                          console.error("Invalid editTaskText:", editTaskText);
                          setEditTaskId(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (
                            editTaskText &&
                            typeof editTaskText === "string" &&
                            editTaskText.trim() !== ""
                          ) {
                            editTaskService(
                              user,
                              task.id,
                              editTaskText,
                              editPriorityText,
                              editPriorityFireColor,
                              setTasks,
                              () => setEditTaskId(null)
                            );
                          } else {
                            console.error(
                              "Invalid editTaskText:",
                              editTaskText
                            );
                            setEditTaskId(null);
                          }
                        }
                      }}
                    />
                  ) : (
                    <div
                      className="task"
                      onDoubleClick={() => {
                        setEditTaskId(task.id);
                        setEditTaskText(task.text);
                        setEditPriorityColor(
                          task.priority === "1"
                            ? "danger"
                            : task.priority === "2"
                            ? "warning"
                            : "info"
                        );
                        setEditPriorityText(task.priority);
                        setEditPriorityFireColor(task.priorityColor);
                      }}
                      onTouchStart={() => {
                        touchTimerRef.current = setTimeout(() => {
                          setEditTaskId(task.id);
                          setEditTaskText(task.text);
                          setEditPriorityColor(
                            task.priority === "1"
                              ? "danger"
                              : task.priority === "2"
                              ? "warning"
                              : "info"
                          );
                          setEditPriorityText(task.priority);
                          setEditPriorityFireColor(task.priorityColor);
                        }, 500);
                      }}
                      onTouchEnd={() => clearTimeout(touchTimerRef.current)}
                      onClick={() => {
                        if (window.innerWidth <= 768) {
                          setEditTaskId(task.id);
                          setEditTaskText(task.text);
                          setEditPriorityColor(
                            task.priority === "1"
                              ? "danger"
                              : task.priority === "2"
                              ? "warning"
                              : "info"
                          );
                          setEditPriorityText(task.priority);
                          setEditPriorityFireColor(task.priorityColor);
                        }
                      }}
                    >
                      <span
                        className={`${task.completed ? "completed-task" : ""} ${
                          expandedTasks[task.id] ? "expanded" : "truncate-text"
                        }`}
                        onClick={() => toggleExpand(task.id)}
                      >
                        {task.text}
                      </span>
                      <small className="task-meta">
                        📅 {task.date} | ⏰ {task.time}
                      </small>
                    </div>
                  )}
                  {/* Delete Button */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskSection;
