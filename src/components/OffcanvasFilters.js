import React from "react";

const OffcanvasFilters = ({
  language, // Current language (e.g., "en" or "ar") to determine UI direction
  languageData, // Object containing language-specific text translations
  sortOrder, // Current sorting order ("asc" or "desc")
  setSortOrder, // Function to update sorting order
  taskFilter, // Current task filter ("all", "completed", or "incomplete")
  setTaskFilter, // Function to update task filter
  priorityFilter, // Current priority filter ("1", "2", or "3")
  togglePriorityFilter, // Function to toggle priority filter selection
}) => {
  return (
    <div
      className={`offcanvas ${
        language === "ar" ? "offcanvas-start" : "offcanvas-end"
      }`}
      tabIndex="-1"
      id="offcanvasMenu"
      aria-labelledby="offcanvasMenuLabel"
    >
      {/* Offcanvas Header */}
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasMenuLabel">
          SimpleDo
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      {/* Offcanvas Body */}
      <div className="offcanvas-body">
        {/* Filter Section Header */}
        <div className="filter-head">
          <i className="fa-solid fa-filter"></i>
          <h6>{languageData?.filtering}</h6>{" "}
          {/* Dynamic language text for "Filtering" */}
        </div>

        {/* Sorting Toggle Button */}
        <div>
          <button
            className="filter-btn filter-active"
            onClick={() => {
              console.log(
                "Sort order toggled to:",
                sortOrder === "asc" ? "desc" : "asc"
              );
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          >
            {/* Icon changes based on sort order */}
            {sortOrder === "asc" ? (
              <i className="fa-solid fa-arrow-up-wide-short"></i>
            ) : (
              <i className="fa-solid fa-arrow-down-short-wide"></i>
            )}
            <p>
              {sortOrder === "asc"
                ? languageData?.sortDescending
                : languageData?.sortAscending}
            </p>
          </button>
        </div>

        {/* Task Status Filter Buttons */}
        <div>
          <button
            className={`filter-btn ${
              taskFilter === "all" ? "filter-active" : ""
            }`}
            onClick={() => setTaskFilter("all")}
          >
            <i className="fa-solid fa-list"></i>
            <p>{languageData?.allTasks}</p>
          </button>
          <button
            className={`filter-btn ${
              taskFilter === "completed" ? "filter-active" : ""
            }`}
            onClick={() => setTaskFilter("completed")}
          >
            <i className="fa-solid fa-circle-check"></i>
            <p>{languageData?.completedTasks}</p>
          </button>
          <button
            className={`filter-btn ${
              taskFilter === "incomplete" ? "filter-active" : ""
            }`}
            onClick={() => setTaskFilter("incomplete")}
          >
            <i className="fa-solid fa-circle-xmark"></i>
            <p>{languageData?.incompleteTasks}</p>
          </button>
        </div>

        {/* Priority Filter Buttons */}
        <div>
          <button
            className={`filter-btn f-btn-red ${
              priorityFilter === "1" ? "filter-active-red" : ""
            }`}
            onClick={() => togglePriorityFilter("1")}
          >
            <div></div>
            <p>{languageData?.high}</p> {/* High-priority tasks */}
          </button>
          <button
            className={`filter-btn f-btn-yellow ${
              priorityFilter === "2" ? "filter-active-yellow" : ""
            }`}
            onClick={() => togglePriorityFilter("2")}
          >
            <div></div>
            <p>{languageData?.medium}</p> {/* Medium-priority tasks */}
          </button>
          <button
            className={`filter-btn f-btn-blue ${
              priorityFilter === "3" ? "filter-active-blue" : ""
            }`}
            onClick={() => togglePriorityFilter("3")}
          >
            <div></div>
            <p>{languageData?.low}</p> {/* Low-priority tasks */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffcanvasFilters;
