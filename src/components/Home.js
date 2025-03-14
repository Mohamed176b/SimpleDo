import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import LanguageSelector from "./LanguageSelector";
import { LanguageContext } from "./LanguageContext";
import Navbar from "./Navbar";
import OffcanvasFilters from "./OffcanvasFilters";
import TaskSection from "./TaskSection";
import CompletedTasks from "./CompletedTasks";
import { initializeUserTasks, fetchTasks } from "./FirebaseTasks";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const { language, setLanguage, languageData } = useContext(LanguageContext);

  // State for managing tasks, task input, editing, filters, sorting, and UI behaviors
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [addPriorityColor, setAddPriorityColor] = useState("warning");
  const [addPriorityText, setAddPriorityText] = useState("2");
  const [addPriorityFireColor, setAddPriorityFireColor] =
    useState("rgb(255, 193, 7)");
  const [editPriorityColor, setEditPriorityColor] = useState(null);
  const [editPriorityText, setEditPriorityText] = useState(null);
  const [editPriorityFireColor, setEditPriorityFireColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState({});

  // Update the document's language and text direction when language changes
  useEffect(() => {
    try {
      if (document && document.documentElement) {
        document.documentElement.lang = language;
        document.documentElement.dir = language === "en" ? "ltr" : "rtl";

        // Update meta description for SEO if language data is available
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription && languageData?.desc) {
          metaDescription.setAttribute("content", languageData.desc);
        }
        console.log(`🌍 Language updated: ${language}.`);
      }
    } catch (error) {
      console.error(
        "❌ Error updating language attributes:",
        error.message || error
      );
    }
  }, [language, languageData]);

  // Load user data from Firebase when the user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;
      try {
        console.log("🔄 Initializing user tasks...");
        await initializeUserTasks(user); // Ensure user has a task collection in Firebase
        console.log("📥 Fetching user tasks...");
        await fetchTasks(user, setTasks, setIsLoading); // Retrieve tasks from Firebase
        console.log("🎉 User data loaded successfully.");
      } catch (error) {
        console.error("❌ Error loading user data:", error.message || error);
      }
    };
    loadUserData();
  }, [user?.uid]);

  // Function to toggle priority filter (between high, medium, low, or none)
  const togglePriorityFilter = (priority) => {
    try {
      const validPriorities = ["1", "2", "3", null];
      if (!validPriorities.includes(priority)) {
        console.warn(
          `⚠️ Invalid priority value: ${priority}. Expected one of ${validPriorities.join(
            ", "
          )}`
        );
        return;
      }
      setPriorityFilter((prevPriority) => {
        const newPriority = prevPriority === priority ? null : priority;
        console.log(
          `🔄 Priority filter changed: ${
            newPriority ? `Priority ${newPriority}` : "No filter"
          }`
        );
        return newPriority;
      });
    } catch (error) {
      console.error(
        "❌ Error toggling priority filter:",
        error.message || error
      );
    }
  };

  // Function to toggle task description expansion/collapse
  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="todo-body">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        language={language}
        languageData={languageData}
        setLanguage={setLanguage}
        navigate={navigate}
      />

      {/* Offcanvas filter menu */}
      <OffcanvasFilters
        language={language}
        languageData={languageData}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
        priorityFilter={priorityFilter}
        togglePriorityFilter={togglePriorityFilter}
      />

      <div className="main container-fluid">
        {/* User welcome message */}
        <div className="user-name">
          {`${languageData?.wel} ${(user?.displayName).toUpperCase()}`}
        </div>

        <div className="the-field">
          {/* Task list section */}
          <TaskSection
            user={user}
            languageData={languageData}
            tasks={tasks
              .filter((task) => {
                // Apply status filter (all, completed, incomplete)
                const statusFilter =
                  taskFilter === "all"
                    ? true
                    : taskFilter === "completed"
                    ? task.completed
                    : !task.completed;

                // Apply priority filter if selected
                const priorityFilterCondition = priorityFilter
                  ? task.priority === priorityFilter
                  : true;

                return statusFilter && priorityFilterCondition;
              })
              .sort((a, b) => {
                // Sort tasks based on priority in ascending or descending order
                return sortOrder === "asc"
                  ? Number(a.priority) - Number(b.priority)
                  : Number(b.priority) - Number(a.priority);
              })}
            newTask={newTask}
            setNewTask={setNewTask}
            setEditTaskId={setEditTaskId}
            addPriorityColor={addPriorityColor}
            setAddPriorityColor={setAddPriorityColor}
            addPriorityText={addPriorityText}
            setAddPriorityText={setAddPriorityText}
            addPriorityFireColor={addPriorityFireColor}
            setAddPriorityFireColor={setAddPriorityFireColor}
            editTaskId={editTaskId}
            editTaskText={editTaskText}
            setEditTaskText={setEditTaskText}
            editPriorityColor={editPriorityColor}
            setEditPriorityColor={setEditPriorityColor}
            editPriorityText={editPriorityText}
            setEditPriorityText={setEditPriorityText}
            editPriorityFireColor={editPriorityFireColor}
            setEditPriorityFireColor={setEditPriorityFireColor}
            isLoading={isLoading}
            toggleExpand={toggleExpand}
            expandedTasks={expandedTasks}
            setTasks={setTasks}
            tasksArray={tasks}
          />

          {/* Completed tasks section */}
          <CompletedTasks
            tasks={tasks}
            isLoading={isLoading}
            languageData={languageData}
            toggleTaskCompletion={() => {}} // Placeholder function for toggling completion
            user={user}
          />
        </div>
      </div>

      {/* Language selector component */}
      <LanguageSelector
        language={language}
        handleLanguageChange={setLanguage}
      />
    </div>
  );
}

export default Home;
