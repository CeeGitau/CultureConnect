import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Validation from "../components/validation";
import "../assests/css/form.css";
import axios from "axios";
import { UserContext } from "../App";
import Loader from "../components/loader";

function Login() {
  const navigate = useNavigate();
  const { setUser, setIsOnline } = useContext(UserContext);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const errs = Validation(values);
    setErrors(errs);
    if (errs.email === "" && errs.password === "") {
      axios
        .post("login", values, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            setIsOnline(true);
            toast.success(`Welcome ${res.data.user.name}`, {
              position: "top-right",
              autoClose: 2000,
            });

            navigate("/dashboard");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            const status = err.response.status;
            const errorMessage = err.response.data.message;
            if (status === 400) {
              if (errorMessage === "User not found") {
                setServerErrors([{ msg: "You currently do not have an account" }]);
              } else if (errorMessage === "Password is incorrect!") {
                setServerErrors([{ msg: "Password is incorrect!" }]);
              } else {
                setServerErrors([{ msg: errorMessage }]);
              }
            } else if (status === 401) {
              setServerErrors([{ msg: "Unauthorized access!" }]);
            } else {
              setServerErrors([{ msg: "An unexpected error occurred. Please try again." }]);
            }
          } else {
            console.log(err);
          }
        });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail:
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              autoComplete="off"
              placeholder="E-mail Address"
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <label htmlFor="name" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          {serverErrors.length > 0 &&
            serverErrors.map((error, index) => (
              <p className="error" key={index}>
                {error.msg}
              </p>
            ))}
          <button className="form-btn">Sign in</button>
          <p>
            Don't have an account? <Link to="/register">Sign up!</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
