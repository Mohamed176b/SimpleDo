import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Keep API keys secure and avoid hardcoding
  authDomain: "simpledo-c702b.firebaseapp.com",
  projectId: "simpledo-c702b",
  storageBucket: "simpledo-c702b.appspot.com",
  messagingSenderId: "839756610539",
  appId: "1:839756610539:web:a28c6210c86920c41437ae",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
