import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Initializes a Firestore document for the user's tasks if it doesn't already exist.
 *
 * @param {Object} user - The authenticated user object.
 */
export const initializeUserTasks = async (user) => {
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

    // Reference to the user's task document
    const userRef = doc(db, "tasks", user.uid);
    const userSnap = await getDoc(userRef);

    // Create the task document if it doesn't exist
    if (!userSnap.exists()) {
      await setDoc(userRef, { uid: user.uid });
      console.log("✅ User tasks document created successfully.");
    } else {
      console.log("ℹ️ User tasks document already exists.");
    }
  } catch (error) {
    console.error("❌ Error initializing user tasks:", error.message || error);
  }
};

/**
 * Fetches tasks for the signed-in user from Firestore and updates the state.
 *
 * @param {Object} user - The authenticated user object.
 * @param {Function} setTasks - Function to update tasks state.
 * @param {Function} setIsLoading - Function to toggle loading state.
 */
export const fetchTasks = async (user, setTasks, setIsLoading) => {
  setIsLoading(true);
  try {
    if (!user?.uid) {
      console.warn("⚠️ No user is currently signed in. Skipping task fetch.");
      return;
    }
    if (!db) {
      throw new Error("Firestore database instance is not available.");
    }

    // Reference to the user's tasks collection
    const tasksRef = collection(db, "tasks", user.uid, "userTasks");
    const querySnapshot = await getDocs(tasksRef);

    if (querySnapshot.empty) {
      console.log("ℹ️ No tasks found for the user.");
    }

    // Map the tasks to an array
    const tasksArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update the state with fetched tasks
    setTasks(tasksArray);
    console.log(`✅ Successfully fetched ${tasksArray.length} tasks.`);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error.message || error);
  } finally {
    setIsLoading(false);
  }
};

/**
 * Adds a new task to Firestore and updates the state.
 *
 * @param {Object} user - The authenticated user object.
 * @param {string} newTask - The task text.
 * @param {string} addPriorityText - Priority label.
 * @param {string} addPriorityFireColor - Priority color.
 * @param {Function} setTasks - Function to update tasks state.
 * @param {Function} resetTaskForm - Function to reset input fields.
 */
export const addTask = async (
  user,
  newTask,
  addPriorityText,
  addPriorityFireColor,
  setTasks,
  resetTaskForm
) => {
  if (!user?.uid || !newTask.trim()) return;

  // Generate task timestamp
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB");
  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Task object
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

    // Update state with new task
    const newTaskWithId = { id: docRef.id, ...taskData };
    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
  } catch (error) {
    console.error("❌ Error adding task:", error.message || error);
  }

  // Reset input fields
  resetTaskForm();
};

/**
 * Edits an existing task in Firestore and updates the state.
 *
 * @param {Object} user - The authenticated user object.
 * @param {string} taskId - The ID of the task to edit.
 * @param {string} editTaskText - The updated task text.
 * @param {string} editPriorityText - The updated priority label.
 * @param {string} editPriorityFireColor - The updated priority color.
 * @param {Function} setTasks - Function to update tasks state.
 * @param {Function} onEditComplete - Callback function after edit completion.
 */
export const editTask = async (
  user,
  taskId,
  editTaskText,
  editPriorityText,
  editPriorityFireColor,
  setTasks,
  onEditComplete
) => {
  if (!user?.uid) return;

  // Trim and validate task text
  const trimmedText = String(editTaskText).trim();
  if (!trimmedText) {
    console.warn("Task text is empty after trimming.");
    return;
  }

  // Generate timestamp
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB");
  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  try {
    const taskRef = doc(db, "tasks", user.uid, "userTasks", taskId);

    // Update task in Firestore
    await setDoc(
      taskRef,
      {
        text: trimmedText,
        date: formattedDate,
        time: formattedTime,
        priority: editPriorityText,
        priorityColor: editPriorityFireColor,
      },
      { merge: true }
    );

    // Update local state with edited task
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              text: trimmedText,
              date: formattedDate,
              time: formattedTime,
              priority: editPriorityText,
              priorityColor: editPriorityFireColor,
            }
          : task
      )
    );

    onEditComplete();
  } catch (error) {
    console.error("❌ Error editing task:", error.message || error);
  }
};

/**
 * Delete Task from Firestore
 *
 * @param {Object} user - Authenticated user object.
 * @param {string} taskId - The ID of the task to be deleted.
 */
export const deleteTask = async (user, taskId) => {
  try {
    if (!user?.uid) {
      console.warn(
        "⚠️ There is no currently registered user. Skip the deletion process."
      );
      return;
    }
    if (!db) {
      throw new Error("The Firestore database instance is unavailable.");
    }

    const taskRef = doc(db, "tasks", user.uid, "userTasks", taskId);
    await deleteDoc(taskRef);
    console.log(`✅ The task has been successfully deleted: ${taskId}`);
  } catch (error) {
    console.error("❌ Error deleting the task:", error.message || error);
  }
};

/**
 * Toggles the completion status of a task in Firestore and updates the state.
 *
 * @param {Object} user - The authenticated user object.
 * @param {string} taskId - The ID of the task to toggle.
 * @param {boolean} currentStatus - The current completion status of the task.
 * @param {Function} setTasks - Function to update tasks state.
 * @param {Array} tasks - List of current tasks.
 * @param {Function} setCompletedTasks - Function to update completed tasks state.
 */
export const toggleTaskCompletion = async (
  user,
  taskId,
  currentStatus,
  setTasks,
  tasks,
  setCompletedTasks
) => {
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

    // Toggle completion status in Firestore
    await setDoc(taskRef, { completed: !currentStatus }, { merge: true });

    console.log(
      `✅ Task ${taskId} marked as ${
        !currentStatus ? "completed" : "incomplete"
      }.`
    );

    // Update local tasks state
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      )
    );

    // Update completed tasks list
    setCompletedTasks((prevCompletedTasks) => {
      if (!currentStatus) {
        const completedTask = tasks.find((task) => task.id === taskId);
        return [...prevCompletedTasks, { ...completedTask, completed: true }];
      } else {
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
