import React, { useContext, useEffect } from "react";
//import { UserContext } from "../App";
import UserContext from "./UserContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import "../assests/css/dashboard.css";

function Logout() {
  const { setUser, setIsOnline } = useContext(UserContext);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  useEffect(() => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        setUser(null);
        setIsOnline(false);
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    });
  }, [MySwal, setUser, navigate, setIsOnline]);

  return <div className="logout"></div>;
}

export default Logout;
