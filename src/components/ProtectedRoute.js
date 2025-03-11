import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = location.state?.user; // Retrieve user data from route state

  if (!user) {
    console.warn("Unauthorized access attempt - Redirecting to login page");
    return <Navigate to="/" replace />; // Redirect to login page if user is not authenticated
  }

  return children; // Render protected content if user is authenticated
};

export default ProtectedRoute;
