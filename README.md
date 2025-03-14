# Task Manager - A Simple To-Do List App

**Task Manager** is a lightweight task management application designed to help users organize their tasks efficiently. It supports bilingual functionality (English and Arabic) with automatic text direction switching and integrates with Firebase for authentication and task storage.

## [See Website](https://mohamed176b.github.io/SimpleDo/)

## Features

- **Google Sign-In**: Secure authentication using Google accounts.
- **Task Management**: Add, edit, and delete tasks easily.
- **Task Filtering**: Filter tasks based on completion status and priority.
- **Bilingual Support**: Switch between English and Arabic with automatic text layout adjustments.
- **Priority Levels**: Assign priority to tasks with color-coded indicators.
- **Loading Indicators**: Smooth user experience with loading placeholders.
- **Task Timestamping**: Track creation date and time of tasks.

## Prerequisites

To run the application locally, ensure you have:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli) (optional for deployment)
- A Firebase project set up in [Firebase Console](https://console.firebase.google.com/)

## Installation

Follow these steps to set up and run the application locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repository/task-manager.git
   cd task-manager
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Firebase**:
   - Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** and configure Google Sign-In.
   - Enable **Firestore** as the database.
   - Register a web app in Firebase and obtain API credentials.
   - Create a `.env` file in the project root and add the Firebase API key:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     ```

4. **Run the Application Locally**:
   ```bash
   npm start
   ```
   - The app will be available at `http://localhost:3000`.

## Usage

1. **Sign In**:
   - Click "Sign in with Google" to authenticate.

2. **Add a Task**:
   - Enter a task, select priority, and click "Add".

3. **Edit a Task**:
   - Double-click or long-press a task to edit details.

4. **Complete a Task**:
   - Mark a task as complete using the checkbox.

5. **Filter Tasks**:
   - Use the filter menu to sort by status or priority.

6. **Change Language**:
   - Switch between English and Arabic via the language selector.

## File Structure

- **`firebase.js`**: Initializes Firebase authentication and Firestore.
- **`LanguageContext.js`**: Manages language preferences and translations.
- **`Home.js`**: The main task management interface.
- **`Auth.js`**: Handles Google authentication.
- **`CompletedTasks.js`**: Displays completed tasks.
- **`ProtectedRoute.js`**: Protects authentication-restricted routes.
- **`LanguageSelector.js`**: Allows users to switch between languages.
- **`Navbar.js`**: Navigation bar with user authentication options.
- **`OffcanvasFilters.js`**: Sidebar filters for sorting and prioritizing tasks.
- **`PriorityUtils.js`**: Utility functions for handling task priorities.
- **`TaskSection.js`**: Manages task input, display, and actions.
- **`App.js`**: Configures routes and initializes the application.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Firebase](https://firebase.google.com/): For providing authentication and database services.
- [React](https://reactjs.org/): For building the user interface.
- [Bootstrap](https://getbootstrap.com/): For quick design and layout.

## Notes

- Ensure `.env` contains the correct Firebase API key.
- Configure Firestore security rules for data protection.

