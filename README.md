# SimpleDo - A Simple Task Management App

**SimpleDo** is a straightforward task management (To-Do List) application that allows users to manage their tasks easily and efficiently. It supports two languages (English and Arabic) with automatic text direction switching and integrates with Firebase for Google Sign-In and task storage in Firestore.

## [See Website](https://mohamed176b.github.io/SimpleDo/)

## Features

- **Google Sign-In**: Secure and quick login using Google accounts.
- **Task Management**: Easily add, edit, and delete tasks.
- **Task Filtering**: Filter tasks by status (completed/incomplete) or priority (high/medium/low).
- **Bilingual Support**: Switch between English and Arabic with automatic text and layout adjustments.
- **Priority Assignment**: Assign priorities to tasks with visual color indicators.
- **Loading Effects**: Display placeholders while fetching data to enhance user experience.
- **Timestamping**: Show creation date and time for each task.

## Prerequisites

To run the application locally, you will need:

- [Node.js](https://nodejs.org/) (version v14 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli) (optional for deployment)
- An account on [Firebase Console](https://console.firebase.google.com/) to set up the project

## Installation

Follow these steps to install and run the application locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Mohamed176b/SimpleDo.git
   cd SimpleDo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Firebase**:
   - Create a new project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** and select Google Sign-In.
   - Enable **Firestore** as the database.
   - Add a web app to your Firebase project to obtain the API key.
   - Create a `.env` file in the project root and add the API key as follows:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     ```

4. **Run the Application Locally**:
   ```bash
   npm start
   ```
   - The application will run on `http://localhost:3000`.

## Usage

1. **Sign In**:
   - Open the application and click the "Sign in with Google" button to log in using your Google account.

2. **Add a Task**:
   - Click "Add Task," enter the task text, select the priority (high/medium/low), and click "+" to add it.

3. **Edit a Task**:
   - Double-click on a task (or long-press on mobile) to edit the text or priority, then save the changes.

4. **Complete a Task**:
   - Mark a task as completed by checking the box next to it.

5. **Filter Tasks**:
   - Use the filter menu in the sidebar to view tasks by status or priority.

6. **Change Language**:
   - Click the language button at the bottom of the screen to switch between English and Arabic.

## File Structure

- **`firebase.js`**: Initializes Firebase and exports authentication and database services.
- **`LanguageContext.js`**: Provides context for managing language and fetching language data from Firestore.
- **`Home.js`**: The main component for the task page, including task management, filtering, and editing.
- **`ProtectedRoute.js`**: A component to protect routes that require authentication.
- **`LanguageSelector.js`**: A component for selecting and displaying language options.
- **`index.js`**: Initializes the React application and provides context.
- **`App.js`**: Contains the application routes and integrates with Firebase for sign-in.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Firebase](https://firebase.google.com/): For providing authentication and database services.
- [React](https://reactjs.org/): For building the user interface.
- [Bootstrap](https://getbootstrap.com/): For quick design and layout.

## Additional Notes

- Ensure the API key is set in the `.env` file for the application to function correctly.
- It is recommended to review the Firebase documentation for setting up Firestore security rules.
