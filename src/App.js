import "./App.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./components/firebase";
import LanguageSelector from "./components/LanguageSelector";
import { LanguageContext } from "./components/LanguageContext";

const provider = new GoogleAuthProvider();

function App() {
  const navigate = useNavigate();
  const { language, setLanguage, languageData } = useContext(LanguageContext);

  // Handle Google Sign-in
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User signed in"); // Logging user details

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
      console.error("Error signing in:", error.message); // Improved error handling
      alert("Failed to sign in. Please try again."); // User-friendly error feedback
    }
  };

  // Update HTML lang attribute and meta description
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && languageData?.desc) {
      metaDescription.setAttribute("content", languageData.desc);
    }
  }, [language, languageData]);

  return (
    <Routes>
      {/* Login Page */}
      <Route
        path="/SimpleDo"
        element={
          <div className="container-fluid p-0 vh-100 caro-car position-relative">
            {/* Carousel Section */}
            <div
              id="carouselExampleAutoplaying"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
              dir="ltr"
            >
              <div className="carousel-inner position-relative">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`carousel-item ${num === 1 ? "active" : ""}`}
                    data-bs-interval="10000"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/imgs/caro${num}.jpg`}
                      className="d-block caro-car-img"
                      alt={`caro ${num}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <LanguageSelector
              language={language}
              handleLanguageChange={setLanguage}
            />

            {/* Login Section */}
            <div className="login-card w-custom">
              <div
                className={`back ${
                  language === "en" ? "text-start" : "text-end"
                }`}
              >
                <h1 className="placeholder-glow">
                  {languageData?.wel ? (
                    languageData.wel
                  ) : (
                    <span className="placeholder col-6"></span>
                  )}
                </h1>
                <p className="placeholder-glow">
                  {languageData?.logP ? (
                    languageData.logP
                  ) : (
                    <span className="placeholder col-12"></span>
                  )}
                </p>
              </div>
              <div className="login-from">
                <h3 className="placeholder-glow">
                  {languageData?.logH ? (
                    languageData.logH
                  ) : (
                    <span className="placeholder col-4"></span>
                  )}
                </h3>
                <button className="provider" onClick={signIn}>
                  <img src="imgs/google.png" alt="Google" />
                </button>
              </div>
            </div>
          </div>
        }
      />

      {/* Home Page */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* 404 Page */}
      <Route path="*" element={<div id="error">Error 404: Not Found</div>} />
    </Routes>
  );
}

export default App;
