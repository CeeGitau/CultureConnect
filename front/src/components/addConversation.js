import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "../assests/css/conversation.css";
import axios from "axios";
import { toast } from "react-toastify";
//import { UserContext } from "../App";
import UserContext from "../pages/UserContext";
import Loader from "./loader";

function AddConversation() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [audio, setAudio] = useState("");
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const valueData = {
      ...values,
      author: user.name,
      image: image,
      audio: audio,
    };
    axios
      .post("addConversation", valueData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          toast.success("Conversation Posted!", {
            position: "top-right",
            autoClose: 500,
          });
          navigate("/conversation");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Error while posting!", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log(err);
      });
  };

  const categories = [
    "Food & Cuisine",
    "Clothing & Fashion",
    "Music & Dance",
    "Languages & Culture",
    "Festivals & Holidays",
    "Arts & Handicrafts",
    "Literature & Poetry",
    "Customs & Traditions",
    "Religious Practices & Beliefs",
    "Sports & Games",
    "Architecture & Design",
    "Films & Theatre",
    "Folk Tales & Legends",
    "Etiquette & Social Norms",
  ];

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
    } catch (error) {
      console.error("Error converting image file:", error);
      toast.error("Error uploading image file", { position: "top-right" });
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    try {
      const base64Data = await convertFileToBase64(file);
      setAudio(base64Data);
    } catch (error) {
      console.error("Error converting audio file:", error);
      toast.error("Error uploading audio file", { position: "top-right" });
    }
  };

  const back = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className="add-conversation">
        <form
          className="conversation-form"
          onSubmit={handleSubmit}
          data-cy="form"
        >
          <label htmlFor="Category">Select a Category</label>
          <select name="category" onChange={handleChange} data-cy="category">
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
            data-cy="title"
          />
          <label htmlFor="thoughts">Thoughts</label>
          <textarea
            id="thoughts"
            onChange={handleChange}
            name="thoughts"
            rows="10"
            cols="30"
            data-cy="thoughts"
          ></textarea>
          <label htmlFor="imageUpload">Upload Image:</label>
          <input
            id="imageUpload"
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
            data-cy="image-upload"
          />
          <label htmlFor="audioUpload">Upload Audio:</label>
          <input
            id="audioUpload"
            accept="audio/*"
            type="file"
            onChange={handleAudioUpload}
            data-cy="audio-upload"
          />
          <label htmlFor="author">Author: {user.name}</label>{" "}
          <div className="button-container">
            <button
              className="submit-button"
              type="submit"
              data-cy="submit-button"
            >
              Post
            </button>
            <button className="cancel-button" type="button" onClick={back}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddConversation;
