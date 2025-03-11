import { createContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Create Language Context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize language state from localStorage or default to English
  const [language, setLanguage] = useState(
    localStorage.getItem("preferredLanguage") || "en"
  );
  const [languageData, setLanguageData] = useState(null);

  useEffect(() => {
    // Save selected language to localStorage for persistence
    localStorage.setItem("preferredLanguage", language);

    const fetchLanguageData = async () => {
      try {
        const docRef = doc(db, "langs", language);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLanguageData(docSnap.data()); // Set retrieved language data
        } else {
          console.warn("Language data not found for:", language);
          setLanguageData(null);
        }
      } catch (error) {
        console.error("Error fetching language data:", error); // Improved error handling
      }
    };

    fetchLanguageData();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageData }}>
      {children}
    </LanguageContext.Provider>
  );
};
