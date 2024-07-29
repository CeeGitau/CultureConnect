import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashAlt,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assests/css/conversation.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//import { UserContext } from "../App";

import UserContext from "../pages/UserContext";
import Icons from "./icons.js";
import Loader from "./loader";

const MySwal = withReactContent(Swal);

const MyConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [commentsCounts, setCommentsCounts] = useState({});

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = () => {
    axios
      .get("conversations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (response.data.success) {
          const myConversations = response.data.conversations.filter(
            (conversation) => conversation.author === user.name
          );
          setConversations(myConversations);
          initializeCommentsCounts(response.data.conversations);
        } else {
          toast.error("No conversations found", { position: "top-right" });
        }
      })
      .catch((err) => {
        toast.error("Error fetching conversations", { position: "top-right" });
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initializeCommentsCounts = (conversations) => {
    const initialCounts = conversations.reduce((acc, conversation) => {
      return { ...acc, [conversation._id]: 0 };
    }, {});
    setCommentsCounts(initialCounts);
    conversations.forEach((conversation) => {
      fetchCommentsCount(conversation._id);
    });
  };

  const fetchCommentsCount = (conversationId) => {
    axios
      .get(`comments/${conversationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (response.data.success) {
          setCommentsCounts((prevCounts) => ({
            ...prevCounts,
            [conversationId]: response.data.comments.length,
          }));
        }
      })
      .catch((err) => {
        toast.error("Error fetching comments", { position: "top-right" });
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete this?",
      text: "You wont be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`conversation/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            fetchConversations();
            MySwal.fire({
              title: "Deleted!",
              text: "Deleted successfully",
              icon: "success",
            });
          })
          .catch((err) => {
            MySwal.fire({
              title: "Error!",
              text: "An error occured",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="conversations-container">
        {loading ? (
          <Loader />
        ) : (
          <>
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <h1>No posts available</h1>
                <p>
                  Start the <Link to="/dashboard">Conversation</Link>
                </p>
              </div>
            ) : (
              <div className="reddit-style-container">
                {conversations.map((conversation) => (
                  <div key={conversation._id} className="reddit-style-card">
                    <div className="card-header">
                      <Icons category={conversation.category} />
                      <h2>{conversation.category}</h2>
                    </div>
                    <div className="card-body">
                      <h3>
                        <Link
                          to={`/conversation/${conversation._id}`}
                          className="conversation-title"
                        >
                          {conversation.title}
                        </Link>
                      </h3>
                      <p className="card-author">
                        {user.name === conversation.author
                          ? "You posted"
                          : `Posted by ${conversation.author}`}
                      </p>
                      {conversation.image ? (
                        <div className="conversation-image-container">
                          <img
                            src={conversation.image}
                            alt="Conversation_image"
                            className="conversation-image"
                          />
                        </div>
                      ) : (
                        <p className="card-thoughts">{conversation.thoughts}</p>
                      )}
                    </div>
                    <div className="card-bottom">
                      <div className="card-footer">
                        <div className="comments-count">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="comment-icon"
                          />
                          {commentsCounts[conversation._id]}
                        </div>
                        {user.name === conversation.author && (
                          <div className="card-actions">
                            <Link
                              to={`/update-conversation/${conversation._id}`}
                              className="action-link"
                            >
                              <FontAwesomeIcon
                                icon={faPen}
                                className="table-icon"
                              />
                            </Link>
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="table-icon"
                              onClick={() => handleDelete(conversation._id)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyConversations;
