import React from "react";
import { Link } from "react-router-dom";
import { signIn, handleSignOut } from "./Auth";

const Navbar = ({ user, language, languageData, setLanguage, navigate }) => {
  return (
    <nav className="navbar bg-body-tertiary main-nav">
      <div className="container-fluid">
        {/* User Account Dropdown */}
        <div className="btn-group user-drop" dir="ltr">
          {/* User profile image button */}
          <button className="user-img btn btn-sm" type="button">
            <img src={user?.photoURL} alt="User" />
          </button>

          {/* Dropdown Toggle Button */}
          <button
            type="button"
            className="user-b2 btn btn-ms dropdown-toggle dropdown-toggle-split"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="visually-hidden">Toggle Dropdown</span>
          </button>

          {/* User Menu Dropdown */}
          <ul
            className="dropdown-menu user-menu"
            style={
              language === "ar"
                ? { right: "0px", left: "auto" }
                : { left: "0px" }
            }
          >
            {/* Display User Information */}
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

            {/* Sign In Button */}
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => signIn(navigate)}
              >
                {languageData?.signIn}
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            {/* Sign Out Button */}
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => handleSignOut(navigate)}
              >
                {languageData?.signOut}
              </button>
            </li>
          </ul>
        </div>

        {/* Navbar Brand / Logo */}
        <Link className="navbar-brand" to="/home">
          <img
            src={`${process.env.PUBLIC_URL}/imgs/logo.png`}
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
          />
          SimpleDo
        </Link>

        {/* Sidebar Menu Button */}
        <button
          className="btn bars-btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasMenu"
          aria-controls="offcanvasMenu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
