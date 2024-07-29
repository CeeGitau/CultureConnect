import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import "../assests/css/conversation.css";
import axios from "axios";
import { toast } from "react-toastify";
//import { UserContext } from "../App";

import UserContext from "../pages/UserContext";
import Loader from "./loader";

function UpdateConversation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [newImage, setNewImage] = useState("");
  const [imageChange, setImageChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    title: "",
    author: user.name,
    category: "",
    thoughts: "",
    image: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const valueData = {
      ...values,
      author: user.name,
      image: imageChange ? newImage : values.image,
    };
    axios
      .put("update-conversation/" + id, valueData, {
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
        toast.error("Error while updating!", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("conversation/" + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          setValues({
            title: response.data.conversation.title,
            author: response.data.conversation.author,
            category: response.data.conversation.category,
            thoughts: response.data.conversation.thoughts,
            image: response.data.conversation.image,
          });
        } else {
          toast.error("No conversations found", { position: "top-right" });
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Error fetching conversations", { position: "top-right" });
        console.error(err);
      });
  }, [id]);

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

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewImage(reader.result);
      setImageChange(true);
    };
    reader.onerror = (error) => {
      console.log("Error:", error);
      alert("Error");
    };
  };

  const back = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className="add-conversation">
        <form className="conversation-form" onSubmit={handleSubmit}>
          <label htmlFor="Category">Select a Category</label>
          <select
            name="category"
            onChange={handleChange}
            value={values.category || ""}
          >
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
            value={values.title || ""}
          />
          <label htmlFor="thoughts">Thoughts</label>
          <textarea
            id="thoughts"
            onChange={handleChange}
            name="thoughts"
            rows="10"
            cols="30"
            value={values.thoughts || ""}
          ></textarea>
          <label htmlFor="imageUpload">Change Image:</label>
          <input
            id="imageUpload"
            accept="image/*"
            type="file"
            onChange={convertToBase64}
          />

          <div>
            <img
              src={values.image}
              alt="Conversation_image"
              className="conversation-image"
            />
          </div>
          <label htmlFor="author">Author: {user.name}</label>

          <div className="button-container">
            <button className="submit-button" type="submit">
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

export default UpdateConversation;
