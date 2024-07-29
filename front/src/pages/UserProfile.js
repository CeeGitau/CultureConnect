import React, { useContext, useEffect, useState, useCallback } from "react";
//import { UserContext } from "../App";
import  UserContext  from "../pages/UserContext";
import axios from "axios";
import "../assests/css/userProfile.css";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import defaultProfilePic from "../assests/css/defaultProfilePic.png";
import { Link } from "react-router-dom";
import AddProfile from "../components/addProfile";
import Loader from "../components/loader";

function UserProfile() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    bio: "",
    ethnicity: "",
  });
  const [image, setImage] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);
  const [data, setData] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const filteredProfile = response.data.results.find(
        (profile) => profile.postedBy === user._id
      );

      if (filteredProfile) {
        setData(true);
      } else {
        setLoading(false);
      }

      if (filteredProfile) {
        setLoading(false);
        setValues({
          firstname: filteredProfile.firstname,
          lastname: filteredProfile.lastname,
          gender: filteredProfile.gender,
          bio: filteredProfile.bio,
          ethnicity: filteredProfile.ethnicity,
        });
        if (filteredProfile.image) {
          setProfilePicPreview(filteredProfile.image);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile data", { position: "top-right" });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value || e.target.id,
    }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  /*const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Image = await convertFileToBase64(file);
      setImage(base64Image);
      setProfilePicPreview(base64Image);
    } catch (error) {
      console.error("Error converting image file:", error);
      toast.error("Error uploading image file", { position: "top-right" });
    }
  };*/

  if (!user) {
    return <p>Please log in to view your profile</p>;
  }

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <br />
      {data ? (
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
              <p>Username: {user.name}</p>
              <p>E-mail: {user.email}</p>
              <div className="profile-input">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="firstname"
                  value={values.firstname}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="profile-input">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="lastname"
                  value={values.lastname}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="gender-options">
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    id="male"
                    checked={values.gender === "male"}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <label htmlFor="male" className="form-radio-label">
                    Male
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    id="female"
                    checked={values.gender === "female"}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <label htmlFor="female" className="form-radio-label">
                    Female
                  </label>
                </div>
              </div>
              <div className="profile-input">
                <label htmlFor="ethnicity">Ethnicity</label>
                <input
                  type="text"
                  name="ethnicity"
                  value={values.ethnicity}
                  onChange={handleChange}
                  placeholder="Enter your ethnicity"
                />
              </div>
              <div className="profile-bio">
                <label htmlFor="bio">Bio</label>
                <textarea
                  name="bio"
                  onChange={handleChange}
                  value={values.bio}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
            <Link
              to={`/update-profile/${user._id}`}
              className="edit-profile-link"
            >
              Edit your profile
            </Link>
          </div>
        </div>
      ) : (
        <AddProfile />
      )}
    </>
  );
}

export default UserProfile;
