import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../assests/css/navbar.css";
import unityIcon from "../assests/icons/unity.png";
import OnlineIndicator from "../components/onlineIndicator.js";
import UserContext from "../pages/UserContext";

function Navbar() {
  const { user, isOnline } = useContext(UserContext);
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-container">
            <img src={unityIcon} alt="img_unity" className="navbar-icon" />
            <span>CultureConnect</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/about" className="navbar-link">
          About
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="navbar-link">
              {user.name} {isOnline && <OnlineIndicator />}
            </Link>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/logout" className="navbar-link">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
