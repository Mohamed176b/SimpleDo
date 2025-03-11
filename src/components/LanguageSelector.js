import React from "react";

const LanguageSelector = ({ language, handleLanguageChange }) => {
  return (
    <div
      className="btn-group dropup lang"
      style={{
        bottom: 15,
        [language === "en" ? "left" : "right"]: 15, // Position based on language direction
      }}
    >
      {/* Button to toggle the language dropdown */}
      <button
        type="button"
        className="btn lang-drop dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="fa-solid fa-language"></i> {language}
      </button>

      {/* Dropdown menu for language selection */}
      <ul className="dropdown-menu lang-drop-menu">
        <li
          className="dropdown-item"
          onClick={() => handleLanguageChange("en")}
        >
          English
        </li>
        <li
          className="dropdown-item"
          onClick={() => handleLanguageChange("ar")}
        >
          العربية
        </li>
      </ul>
    </div>
  );
};

export default LanguageSelector;
