import React, { useContext, useState } from "react";
import UserContext from "../pages/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assests/css/addProfile.css";
import { toast } from "react-toastify";
import defaultProfilePic from "../assests/css/defaultProfilePic.png";
import Loader from "./loader";

function AddProfile() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(defaultProfilePic);

  const tribesOfKenya = [
    "Kikuyu",
    "Luhya",
    "Kalenjin",
    "Luo",
    "Kamba",
    "Somali",
    "Kisii",
    "Mijikenda",
    "Maasai",
    "Taita",
    "Embu",
    "Meru",
    "Turkana",
    "Teso",
    "Ilchamus",
    "Samburu",
    "Rendille",
    "Borana",
    "Gabra",
    "Pokot",
    "Njemps",
    "Galla",
    "Ndorobo",
    "Suba",
    "Ogiek",
    "El Molo",
    "Kuria",
    "Malakote",
    "Swahili",
    "Arabs",
    "Waat",
    "Nubians",
    "Boni",
    "Giriama",
    "Digo",
    "Taveta",
    "Bajuni",
    "Orma",
    "Burji",
    "Sakuye",
  ];

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value || e.target.id });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const valuesData = {
      ...values,
      image: image,
      email: user.email,
      username: user.name,
    };
    axios
      .post("create-profile", valuesData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          toast.success("Profile Saved!", {
            position: "top-right",
            autoClose: 500,
          });
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Error while saving!", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log(err);
      });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Image = await convertFileToBase64(file);
      setImage(base64Image);
      setProfilePicPreview(base64Image); // Update preview with the uploaded image
    } catch (error) {
      console.error("Error converting image file:", error);
      toast.error("Error uploading image file", { position: "top-right" });
    }
  };

  if (!user) {
    return <p>Please log in to view your profile</p>;
  }

  return (
    <>
      {loading && <Loader />}
      <div className="profile-container" data-cy="profile-page">
        <h2 className="profile-heading">User Profile</h2>
        <div className="profile-details">
          <div className="profile-picture">
            <img
              src={profilePicPreview}
              alt="Profile"
              className="profile-img"
            />
            <input type="file" onChange={handleImageUpload} name="image" />
          </div>
          <div className="profile-info">
            <p className="profile-info-item">Username: {user.name}</p>
            <p className="profile-info-item">E-mail: {user.email}</p>
            <div className="profile-input">
              <label htmlFor="firstname" className="profile-label">
                First Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="firstname"
                placeholder="Enter your first name"
                className="profile-input"
              />
            </div>
            <div className="profile-input">
              <label htmlFor="lastname" className="profile-label">
                Last Name
              </label>
              <input
                type="text"
                onChange={handleChange}
                name="lastname"
                placeholder="Enter your last name"
                className="profile-input"
              />
            </div>
            <div className="gender-options">
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  id="male"
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
                  onChange={handleChange}
                  className="form-radio"
                />
                <label htmlFor="female" className="form-radio-label">
                  Female
                </label>
              </div>
            </div>
            <div className="profile-input">
              <div className="profile-ethnicity">
                <label htmlFor="ethnicity" className="profile-label">
                  Ethnicity
                </label>
                <select
                  name="ethnicity"
                  onChange={handleChange}
                  className="profile-select"
                >
                  <option value="">Select Ethnicity</option>
                  {tribesOfKenya.map((tribe) => (
                    <option key={tribe} value={tribe}>
                      {tribe}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="profile-bio">
              <label htmlFor="bio" className="profile-label">
                Bio
              </label>
              <textarea
                name="bio"
                onChange={handleChange}
                className="profile-textarea"
              />
            </div>
            <button onClick={handleSubmit} className="edit-profile-link">
              Save Your Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProfile;
