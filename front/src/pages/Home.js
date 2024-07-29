import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import "../assests/css/home.css";
import { Link } from "react-router-dom";
import unityIcon from "../assests/icons/unity.png";
//import { UserContext } from "../App";

import UserContext from "./UserContext";

function Home() {
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />
      <div className="home">
        <img src={unityIcon} alt="imagicon" className="icon" />
        <h1 className="home-title">CultureConnect</h1>
        <p className="home-description">Bridging Cultures, Connecting Hearts</p>
        {user ? (
          <p className="home-description2">
            Start a <Link to="/dashboard">Conversation</Link>{" "}
          </p>
        ) : (
          <p className="home-description2">
            Get <Link to="/login">Started</Link>{" "}
          </p>
        )}
      </div>
    </>
  );
}

export default Home;
