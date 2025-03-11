import { Link, useLocation } from "react-router-dom";
import { auth, db } from "./firebase";
import { useState, useEffect, useContext, useRef } from "react";
import LanguageSelector from "./LanguageSelector";
import { LanguageContext } from "./LanguageContext";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Logo from "../../public/imgs/logo.png";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

function Home() {
  const location = useLocation();
  const user = location.state?.user;
  const { language, setLanguage, languageData } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const touchTimerRef = useRef(null);
  const provider = new GoogleAuthProvider();
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
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
  const priorityMap = {
    1: {
      color: "danger",
      fireColor: "rgb(220, 53, 69)",
      text: languageData?.high,
    },
    2: {
      color: "warning",
      fireColor: "rgb(255, 193, 7)",
      text: languageData?.medium,
    },
    3: {
      color: "info",
      fireColor: "rgb(13, 202, 240)",
      text: languageData?.low,
    },
  };
  // Sign in function with improved error handling
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      if (!result || !result.user) {
        throw new Error("No user information received from authentication.");
      }

      const user = result.user;

      console.log("User signed in successfully");

      navigate("/home", {
        state: {
          user: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
        },
      });
    } catch (error) {
      console.error("❌ Error signing in:", error.message || error);
      alert("Failed to sign in. Please try again later."); // Optional user feedback
    }
  };

  // Sign out function with improved error handling
  const handleSignOut = async () => {
    try {
      if (!auth.currentUser) {
        console.warn("⚠️ No user is currently signed in.");
        return;
      }

      await signOut(auth);
      console.log("✅ User signed out successfully.");
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("❌ Error signing out:", error.message || error);
      alert("Failed to sign out. Please try again."); // Optional user feedback
    }
  };

  // Update language and direction attributes in HTML tags
  useEffect(() => {
    try {
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.lang = language;
        document.documentElement.dir = language === "en" ? "ltr" : "rtl";

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

  useEffect(() => {
    priorityMap["1"].text = languageData?.high;
    priorityMap["2"].text = languageData?.medium;
    priorityMap["3"].text = languageData?.low;
  }, [languageData]);

  // Load user data when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        console.log("🔄 Initializing user tasks...");
        await initializeUserTasks();

        console.log("📥 Fetching user tasks...");
        await fetchTasks();

        // console.log("✅ Fetching completed tasks...");
        // await fetchCompletedTasks();

        console.log("🎉 User data loaded successfully.");
      } catch (error) {
        console.error("❌ Error loading user data:", error.message || error);
      }
    };

    loadUserData();
  }, [user?.uid]);

  // Initialize user tasks document in Firestore if it doesn't exist
  const initializeUserTasks = async () => {
    try {
      if (!user?.uid) {
        console.warn(
          "⚠️ No user is currently signed in. Skipping task initialization."
        );
        return;
      }

      if (!db) {
        throw new Error("Firestore database instance is not available.");
      }

      const userRef = doc(db, "tasks", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { uid: user.uid });
        console.log(`✅ User tasks document created successfully.`);
      } else {
        console.log(`ℹ️ User tasks document already exists.`);
      }
    } catch (error) {
      console.error(
        "❌ Error initializing user tasks:",
        error.message || error
      );
    }
  };

  // Fetch user tasks from Firestore
  const fetchTasks = async () => {
    setIsLoading(true); // بدء التحميل
    try {
      if (!user?.uid) {
        console.warn("⚠️ No user is currently signed in. Skipping task fetch.");
        return;
      }

      if (!db) {
        throw new Error("Firestore database instance is not available.");
      }

      const tasksRef = collection(db, "tasks", user.uid, "userTasks");
      const querySnapshot = await getDocs(tasksRef);

      if (querySnapshot.empty) {
        console.log("ℹ️ No tasks found for the user.");
      }

      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(tasksArray);
      console.log(`✅ Successfully fetched ${tasksArray.length} tasks.`);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch completed tasks from Firestore
  // const fetchCompletedTasks = async () => {
  //   try {
  //     if (!user?.uid) {
  //       console.warn(
  //         "⚠️ No user is currently signed in. Skipping fetch for completed tasks."
  //       );
  //       return;
  //     }

  //     if (!db) {
  //       throw new Error("Firestore database instance is not available.");
  //     }

  //     const tasksRef = collection(db, "tasks", user.uid, "userTasks");
  //     const q = query(tasksRef, where("completed", "==", true)); // Fetch only completed tasks
  //     const querySnapshot = await getDocs(q);

  //     if (querySnapshot.empty) {
  //       console.log("ℹ️ No completed tasks found.");
  //     }

  //     const completedTasksArray = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     setCompletedTasks(completedTasksArray);
  //     console.log(
  //       `✅ Successfully fetched ${completedTasksArray.length} completed tasks.`
  //     );
  //   } catch (error) {
  //     console.error(
  //       "❌ Error fetching completed tasks:",
  //       error.message || error
  //     );
  //   }
  // };

  // Add a new task to Firestore
  const addTask = async () => {
    if (!user?.uid || !newTask.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const taskData = {
      text: newTask.trim(),
      completed: false,
      date: formattedDate,
      time: formattedTime,
      priority: addPriorityText,
      priorityColor: addPriorityFireColor,
    };

    try {
      const tasksRef = collection(db, "tasks", user.uid, "userTasks");
      const docRef = await addDoc(tasksRef, taskData);
      const newTaskWithId = { id: docRef.id, ...taskData };
      setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    } catch (error) {
      console.error("❌ Error adding task:", error.message || error);
    }

    setNewTask("");
    setAddPriorityText("2");
    setAddPriorityColor("warning");
    setAddPriorityFireColor("rgb(255, 193, 7)");
  };

  // Edit an existing task in Firestore
  const handleEditTask = async (taskId) => {
    if (!user?.uid || !editTaskText.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const priorityValue = editPriorityText;
    const priorityFireColorValue = editPriorityFireColor;

    try {
      const taskRef = doc(db, "tasks", user.uid, "userTasks", taskId);
      await setDoc(
        taskRef,
        {
          text: editTaskText.trim(),
          date: formattedDate,
          time: formattedTime,
          priorityColor: priorityFireColorValue,
          priority: priorityValue,
        },
        { merge: true }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                text: editTaskText.trim(),
                date: formattedDate,
                time: formattedTime,
                priorityColor: priorityFireColorValue,
                priority: priorityValue,
              }
            : task
        )
      );
    } catch (error) {
      console.error("❌ Error editing task:", error.message || error);
    }

    setEditTaskId(null);
  };

  // Toggle task completion status in Firestore
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      if (!user?.uid) {
        console.warn(
          "⚠️ No user is currently signed in. Skipping task completion toggle."
        );
        return;
      }

      if (!db) {
        throw new Error("Firestore database instance is not available.");
      }

      const taskRef = doc(db, "tasks", user.uid, "userTasks", taskId);
      await setDoc(taskRef, { completed: !currentStatus }, { merge: true });

      console.log(
        `✅ Task ${taskId} marked as ${
          !currentStatus ? "completed" : "incomplete"
        }.`
      );

      // Update tasks in UI without reloading
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );

      // Update completed tasks list
      setCompletedTasks((prevCompletedTasks) => {
        if (!currentStatus) {
          // If task is now completed, add it to the completed list
          const completedTask = tasks.find((task) => task.id === taskId);
          return [...prevCompletedTasks, { ...completedTask, completed: true }];
        } else {
          // If task is now incomplete, remove it from the completed list
          return prevCompletedTasks.filter((task) => task.id !== taskId);
        }
      });
    } catch (error) {
      console.error(
        `❌ Error toggling completion status for task ${taskId}:`,
        error.message || error
      );
    }
  };

  // useEffect(() => {
  //   try {
  //     if (
  //       typeof document === "undefined" ||
  //       typeof window.bootstrap === "undefined"
  //     ) {
  //       console.warn(
  //         "⚠️ Bootstrap tooltips cannot be initialized: environment is not supported."
  //       );
  //       return;
  //     }

  //     // Select all elements with data-bs-toggle="tooltip"
  //     const tooltipTriggerList = Array.from(
  //       document.querySelectorAll('[data-bs-toggle="tooltip"]')
  //     );

  //     tooltipTriggerList.forEach((tooltipTriggerEl) => {
  //       try {
  //         // Initialize tooltip for each element using the global bootstrap object
  //         new window.bootstrap.Tooltip(tooltipTriggerEl);
  //       } catch (tooltipError) {
  //         console.error("❌ Error initializing tooltip:", tooltipError);
  //       }
  //     });

  //     console.log(
  //       `✅ Initialized ${tooltipTriggerList.length} Bootstrap tooltips.`
  //     );
  //   } catch (error) {
  //     console.error("❌ Error initializing Bootstrap tooltips:", error);
  //   }
  // }, [tasks]); // Re-run when tasks change

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

  const handleAddColorChange = (event) => {
    const newPriority = event.currentTarget.getAttribute("data-value");
    if (!priorityMap[newPriority]) {
      console.warn("⚠️ Invalid priority selection.");
      return;
    }
    setAddPriorityColor(priorityMap[newPriority].color);
    setAddPriorityFireColor(priorityMap[newPriority].fireColor);
    setAddPriorityText(newPriority);
  };

  const handleEditColorChange = (event) => {
    const newPriority = event.currentTarget.getAttribute("data-value");
    if (!priorityMap[newPriority]) {
      console.warn("⚠️ Invalid priority selection.");
      return;
    }
    setEditPriorityColor(priorityMap[newPriority].color);
    setEditPriorityFireColor(priorityMap[newPriority].fireColor);
    setEditPriorityText(newPriority);
  };

  return (
    <div className="todo-body">
      <nav className="navbar bg-body-tertiary main-nav">
        <div className="container-fluid">
          {/* قائمة الحساب */}
          <div className="btn-group user-drop" dir="ltr">
            <button className="user-img btn btn-sm" type="button">
              <img src={user?.photoURL} alt="User" />
            </button>
            <button
              type="button"
              className="user-b2 btn btn-ms dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul
              className="dropdown-menu user-menu"
              style={
                language === "ar"
                  ? { right: "0px", left: "auto" }
                  : { left: "0px" }
              }
            >
              <li className="dropdown-item no-pointer">
                <div className="user-img">
                  <img src={user?.photoURL} alt="User" />
                </div>
              </li>
              <li className="dropdown-item no-pointer">{user?.displayName}</li>
              <li className="dropdown-item no-pointer">{user?.email}</li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={signIn}
                >
                  {languageData?.signIn}
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={handleSignOut}
                >
                  {languageData?.signOut}
                </button>
              </li>
            </ul>
          </div>

          <Link className="navbar-brand" to="/home">
            <img
              src={Logo}
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            SimpleDo
          </Link>

          <button
            className="btn bars-btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div
            className={`offcanvas ${
              language === "ar" ? "offcanvas-start" : "offcanvas-end"
            }`}
            tabIndex="-1"
            id="offcanvasMenu"
            aria-labelledby="offcanvasMenuLabel"
          >
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
            <div className="offcanvas-body">
              <div className="filter-head">
                <i className="fa-solid fa-filter"></i>
                <h6>{languageData?.filtering}</h6>
              </div>

              {/* زر تبديل الترتيب */}
              <div>
                <button
                  className="filter-btn filter-active"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
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

              {/* تصفية حسب حالة المهمة */}
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

              {/* تصفية حسب الأولوية */}
              <div>
                <button
                  className={`filter-btn f-btn-red ${
                    priorityFilter === "1" ? "filter-active-red" : ""
                  }`}
                  onClick={() => togglePriorityFilter("1")}
                >
                  <div></div>
                  <p>{languageData?.high}</p>
                </button>
                <button
                  className={`filter-btn f-btn-yellow ${
                    priorityFilter === "2" ? "filter-active-yellow" : ""
                  }`}
                  onClick={() => togglePriorityFilter("2")}
                >
                  <div></div>
                  <p>{languageData?.medium}</p>
                </button>
                <button
                  className={`filter-btn f-btn-blue ${
                    priorityFilter === "3" ? "filter-active-blue" : ""
                  }`}
                  onClick={() => togglePriorityFilter("3")}
                >
                  <div></div>
                  <p>{languageData?.low}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="main container-fluid">
        <div className="user-name">{`${
          languageData?.wel
        } ${(user?.displayName).toUpperCase()}`}</div>

        <div className="the-field">
          <div className="main-tasks">
            <div className="title">
              {taskFilter === "all"
                ? languageData?.allTasks
                : taskFilter === "completed"
                ? languageData?.completedTasks
                : taskFilter === "incomplete"
                ? languageData?.incompleteTasks
                : taskFilter === "1"
                ? languageData?.high
                : taskFilter === "2"
                ? languageData?.medium
                : languageData.low}
            </div>

            {/* زر إضافة مهمة */}
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
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder={languageData?.writeNewTask}
                  />

                  <div className="btn-group">
                    <button
                      type="button"
                      className={`btn btn-${addPriorityColor} p-btn`}
                    >
                      {languageData?.priority}
                    </button>
                    <button
                      type="button"
                      className={`btn btn-${addPriorityColor} p-btn dropdown-toggle dropdown-toggle-split`}
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="true"
                      aria-expanded="false"
                    >
                      <span className="visually-hidden">
                        {languageData?.priority}
                      </span>
                    </button>
                    <ul className="dropdown-menu p-menu">
                      <li
                        className="dropdown-item p-red"
                        data-value="1"
                        onClick={handleAddColorChange}
                      >
                        {languageData?.high}
                      </li>
                      <li
                        className="dropdown-item p-yellow"
                        data-value="2"
                        onClick={handleAddColorChange}
                      >
                        {languageData?.medium}
                      </li>
                      <li
                        className="dropdown-item p-blue"
                        data-value="3"
                        onClick={handleAddColorChange}
                      >
                        {languageData?.low}
                      </li>
                    </ul>
                  </div>

                  <button className="add-btn" onClick={addTask}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* قائمة عرض المهام */}
              <ul className="prev-tasks">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <li key={index} className="placeholder-glow">
                        <span className="placeholder col-12"></span>
                      </li>
                    ))
                  : tasks
                      .filter((task) => {
                        const statusFilter =
                          taskFilter === "all"
                            ? true
                            : taskFilter === "completed"
                            ? task.completed
                            : !task.completed;
                        const priorityFilterCondition = priorityFilter
                          ? task.priority === priorityFilter
                          : true;
                        return statusFilter && priorityFilterCondition;
                      })
                      .sort((a, b) => {
                        return sortOrder === "asc"
                          ? a.priority - b.priority
                          : b.priority - a.priority;
                      })
                      .map((task) => (
                        <li
                          key={task.id}
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
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>
                              toggleTaskCompletion(task.id, task.completed)
                            }
                          />
                          {editTaskId === task.id ? (
                            <div className="btn-group">
                              <button
                                type="button"
                                className={`btn btn-${
                                  editPriorityColor || "warning"
                                } p-btn`}
                              >
                                {languageData?.priority}
                              </button>
                              <button
                                type="button"
                                className={`btn btn-${
                                  editPriorityColor || "warning"
                                } p-btn dropdown-toggle dropdown-toggle-split`}
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="true"
                                aria-expanded="false"
                              >
                                <span className="visually-hidden">
                                  {languageData?.priority}
                                </span>
                              </button>
                              <ul className="dropdown-menu p-menu">
                                <li
                                  className="dropdown-item p-red"
                                  data-value="1"
                                  onClick={handleEditColorChange}
                                >
                                  {languageData?.high}
                                </li>
                                <li
                                  className="dropdown-item p-yellow"
                                  data-value="2"
                                  onClick={handleEditColorChange}
                                >
                                  {languageData?.medium}
                                </li>
                                <li
                                  className="dropdown-item p-blue"
                                  data-value="3"
                                  onClick={handleEditColorChange}
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
                              onBlur={() => handleEditTask(task.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditTask(task.id);
                                }
                              }}
                            />
                          ) : (
                            <div className="task">
                              <span
                                className={
                                  task.completed ? "completed-task" : ""
                                }
                              >
                                {task.text}
                              </span>
                              <small className="task-meta">
                                📅 {task.date} | ⏰ {task.time}
                              </small>
                            </div>
                          )}
                        </li>
                      ))}
              </ul>
            </div>

            {/* زر عرض المهام المكتملة */}
            <p className="d-inline-flex gap-1">
              <button
                className="add-task"
                data-bs-toggle="collapse"
                data-bs-target="#completedTasks"
                aria-expanded="false"
                aria-controls="completedTasks"
              >
                {languageData?.done}
              </button>
            </p>

            <div className="collapse" id="completedTasks">
              <div className="card card-body col-card">
                {isLoading ? (
                  <p className="placeholder-glow">
                    <span className="placeholder col-12"></span>
                  </p>
                ) : tasks.filter((task) => task.completed).length > 0 ? (
                  <ul className="completed-tasks prev-tasks p-0">
                    {tasks
                      .filter((task) => task.completed)
                      .sort((a, b) => a.priority - b.priority)
                      .map((task) => (
                        <li key={task.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>
                              toggleTaskCompletion(task.id, task.completed)
                            }
                          />
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
                  <p>{languageData?.noTasks}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LanguageSelector
        language={language}
        handleLanguageChange={setLanguage}
      />
    </div>
  );
}

export default Home;
