// CompletedTasks.js
import React from "react";

const CompletedTasks = ({
  tasks, // List of all tasks
  isLoading, // Boolean flag to indicate loading state
  languageData, // Object containing localized text
  toggleTaskCompletion, // Function to toggle task completion status
  user, // User information for task updates
}) => {
  return (
    <div className="collapse" id="completedTasks">
      <div className="card card-body col-card">
        {isLoading ? ( // Display a loading placeholder while tasks are being fetched
          <p className="placeholder-glow">
            <span className="placeholder col-12"></span>
          </p>
        ) : tasks.filter((task) => task.completed).length > 0 ? ( // Check if there are any completed tasks
          <ul className="completed-tasks prev-tasks p-0">
            {tasks
              .filter((task) => task.completed) // Filter only completed tasks
              .sort((a, b) => a.priority - b.priority) // Sort tasks based on priority
              .map((task) => (
                <li key={task.id}>
                  {/* Checkbox to toggle task completion */}
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleTaskCompletion(user, task.id, task.completed)
                    }
                  />

                  {/* Priority color indicator */}
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

                  {/* Task details */}
                  <div className="task">
                    <span className="completed-task">{task.text}</span>
                    <small className="task-meta">
                      📅 {task.date} | ⏰ {task.time}
                    </small>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          // Message to display if there are no completed tasks
          <p>{languageData?.noTasks}</p>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;
