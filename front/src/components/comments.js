import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
//import { UserContext } from "../App";
import UserContext from "../pages/UserContext";
import "../assests/css/comments.css";
import CustomMoment from "./customMoment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Comments({ conversationId, onCommentsCountUpdate }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsCounts, setCommentsCounts] = useState({});

  const author = user.name;
  useEffect(() => {
    fetchComments();
  }, [conversationId, onCommentsCountUpdate]);

  const fetchComments = async () => {
    if (conversationId) {
      try {
        const response = await axios.get(`comments/${conversationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          const fetchedComments = response.data.comments;
          onCommentsCountUpdate(response.data.comments.length);
          setComments(fetchedComments);
          const countsPromises = fetchedComments.map((conversation) =>
            axios.get(`comments/count/${conversation._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
          );
          const countsResponses = await Promise.all(countsPromises);
          const counts = countsResponses.reduce((acc, res, index) => {
            acc[fetchedComments[index]._id] = res.data.count;
            return acc;
          }, {});
          setCommentsCounts(counts);
        }
      } catch (err) {
        toast.error("Error fetching comments", { position: "top-right" });
        console.error(err);
      }
    }
  };

  const handleNewComment = () => {
    if (conversationId) {
      axios
        .post(
          "comments",
          {
            content: newComment,
            author,
            conversationId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setComments([...comments, response.data.comment]);
          setNewComment("");
        })
        .catch((err) => console.log(err));
    }
  };

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
          .delete(`comments/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            fetchComments();
            MySwal.fire({
              title: "Deleted!",
              text: "Comment deleted",
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
    <div className="comments-section">
      <h3 className="comments-heading">Comments</h3>
      {commentsCounts[conversationId]}
      <br />
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <div className="comments-count">
                <FontAwesomeIcon icon={faComment} className="comment-icon" />
              </div>
              <div className="comment-header">
                <strong className="comment-author">{comment.author}</strong>
                <strong>·</strong>
                <p className="comments-count">
                  <CustomMoment postedTime={comment.createdAt} />
                </p>
              </div>
              <div className="comment-content">
                {comment.content}{" "}
                {user.name === comment.author && (
                  <div className="card-actions">
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="table-icon"
                      onClick={() => handleDelete(comment._id)}
                      data-cy="delete-button"
                    />
                  </div>
                )}
              </div>
              <br />
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments-msg">No comments yet</p>
      )}
      <div className="comment-input-container" data-cy="comment-container">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="comment-input"
          data-cy="comment-input"
        />
        <button
          onClick={handleNewComment}
          className="comment-submit-btn"
          data-cy="submit-button"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default Comments;
