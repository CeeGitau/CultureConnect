import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
//import { UserContext } from "../App";
import UserContext from "../pages/UserContext";
import axios from "axios";
import "../assests/css/userDetails.css";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import defaultProfilePic from "../assests/css/defaultProfilePic.png";

function UserDetails() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    bio: "",
    ethnicity: "",
    email: "",
    username: "",
  });
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`profile/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const profileData = response.data.profile;
      if (profileData) {
        setValues({
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          gender: profileData.gender,
          bio: profileData.bio,
          ethnicity: profileData.ethnicity,
          email: profileData.email,
          username: profileData.username,
        });
        if (profileData.image) {
          setProfilePicPreview(profileData.image);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("This user has not set up a profile yet", {
        position: "top-right",
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id, fetchProfile]);

  if (!user) {
    return <p>Please log in to view profiles</p>;
  }

  return (
    <>
    <Navbar />
    <div className="profile-container">
      <h2 className="profile-heading">User Profile</h2>
      <div className="profile-details">
        <div className="profile-picture">
          <img
            src={profilePicPreview}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="profile-info">
          <div className="profile-info-row">
            <strong>Username:</strong>
            <span>{values.username}</span>
          </div>
          <div className="profile-info-row">
            <strong>E-mail:</strong>
            <span>{values.email}</span>
          </div>
          <div className="profile-info-row">
            <strong>First Name:</strong>
            <span>{values.firstname}</span>
          </div>
          <div className="profile-info-row">
            <strong>Last Name:</strong>
            <span>{values.lastname}</span>
          </div>
          <div className="profile-info-row">
            <strong>Gender:</strong>
            <span>{values.gender}</span>
          </div>
          <div className="profile-info-row">
            <strong>Ethnicity:</strong>
            <span>{values.ethnicity}</span>
          </div>
          <div className="profile-info-row">
            <strong>Bio:</strong>
            <span>{values.bio}</span>
          </div>
        </div>
      </div>
    </div>
  </>

  );
}

export default UserDetails;
