import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assests/css/conversation.css";
import Icons from "../components/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//import { UserContext } from "../App";
import UserContext from "./UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashAlt,
  faComment,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import CustomMoment from "../components/customMoment";
import Loader from "../components/loader";

const MySwal = withReactContent(Swal);

const Conversation = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [commentsCounts, setCommentsCounts] = useState({});
  const [likesCounts, setLikesCounts] = useState({});

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("conversations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        const fetchedConversations = response.data.conversations;
        setConversations(fetchedConversations);

        const countsPromises = fetchedConversations.map((conversation) =>
          axios.get(`comments/count/${conversation._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        );

        const likesPromises = fetchedConversations.map((conversation) =>
          axios.get(`likes/count/${conversation._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        );

        const [countsResponses, likesResponses] = await Promise.all([
          Promise.all(countsPromises),
          Promise.all(likesPromises),
        ]);

        const counts = countsResponses.reduce((acc, res, index) => {
          acc[fetchedConversations[index]._id] = res.data.count;
          return acc;
        }, {});
        setCommentsCounts(counts);

        const likes = likesResponses.reduce((acc, res, index) => {
          acc[fetchedConversations[index]._id] = res.data.count;
          return acc;
        }, {});
        setLikesCounts(likes);
      } else {
        toast.error("No conversations found", { position: "top-right" });
      }
    } catch (err) {
      toast.error("Error fetching conversations", { position: "top-right" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete this?",
      text: "You won't be able to revert this action!",
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
              text: "Conversation deleted successfully",
              icon: "success",
            });
          })
          .catch((err) => {
            MySwal.fire({
              title: "Error!",
              text: "An error occurred while deleting",
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
                      <h2>{conversation.category}</h2> <strong>·</strong>{" "}
                      <p className="comments-count">
                        <CustomMoment postedTime={conversation.createdAt} />
                      </p>
                    </div>{" "}
                    <br />
                    <hr />
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
                        {user.name === conversation.author ? (
                          "You posted"
                        ) : (
                          <>
                            Posted by{" "}
                            <Link to={`/user/${conversation.postedBy}`}>
                              {conversation.author}
                            </Link>
                          </>
                        )}
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
                    <br />
                    <div className="card-bottom">
                      <div className="card-footer">
                        {" "}
                        <div className="comments-count">
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="comment-icon"
                          />
                          {likesCounts[conversation._id]}
                        </div>
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

export default Conversation;
