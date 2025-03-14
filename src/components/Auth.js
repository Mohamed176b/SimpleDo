import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

// Initialize Google authentication provider
const provider = new GoogleAuthProvider();

/**
 * Signs in the user using Google authentication via a popup.
 * Upon successful authentication, navigates to the home page with user details.
 *
 * @param {Function} navigate - Function to navigate to different routes.
 */
export const signIn = async (navigate) => {
  try {
    // Open Google sign-in popup
    const result = await signInWithPopup(auth, provider);

    // Check if the authentication result contains user information
    if (!result || !result.user) {
      throw new Error("No user information received from authentication.");
    }

    const user = result.user;
    console.log("✅ User signed in successfully");

    // Navigate to the home page and pass user details as state
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
    alert("Failed to sign in. Please try again later.");
  }
};

/**
 * Signs out the currently authenticated user.
 * Upon successful sign-out, navigates back to the landing page.
 *
 * @param {Function} navigate - Function to navigate to different routes.
 */
export const handleSignOut = async (navigate) => {
  try {
    // Check if a user is currently signed in
    if (!auth.currentUser) {
      console.warn("⚠️ No user is currently signed in.");
      return;
    }

    // Sign out the user from Firebase authentication
    await signOut(auth);
    console.log("✅ User signed out successfully.");

    // Navigate back to the landing page
    navigate("/SimpleDo");
  } catch (error) {
    console.error("❌ Error signing out:", error.message || error);
    alert("Failed to sign out. Please try again.");
  }
};
