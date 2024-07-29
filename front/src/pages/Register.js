import React, { useState } from "react";
import "../assests/css/form.css";
import { Link } from "react-router-dom";
import Validation from "../components/validation";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const errs = Validation(values);
    setErrors(errs);
    if (errs.name === "" && errs.email === "" && errs.password === "") {
      const valueData = { ...values };
      axios
        .post("register", valueData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success) {
            setLoading(false);
            toast.success("Success!", {
              position: "top-right",
              autoClose: 5000,
            });
            navigate("/login");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.errors) {
            setServerErrors(err.response.data.errors);
          } else {
            console.log(err);
          }
        });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="form-container" data-cy="form-container">
        <form className="form" onSubmit={handleSubmit} data-cy="form">
          <h2>Sign Up</h2>
          <div className="form-group" data-cy="form-group">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              data-cy="name-input"
            />
            {errors.name && (
              <span className="error">
                {errors.name}
              </span>
            )}
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
              data-cy="email-input"
            />
            {errors.email && (
              <span className="error" data-cy="email-error">
                {errors.email}
              </span>
            )}
            <label htmlFor="name" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              data-cy="password-input"
            />
            {errors.password && (
              <span className="error" data-cy="password-error">
                {errors.password}
              </span>
            )}
          </div>

          {serverErrors.length > 0 &&
            serverErrors.map((error, index) => (
              <p
                className="error"
                key={index}
                data-cy={`server-error-${index}`}
              >
                {error.msg}
              </p>
            ))}
          <button className="form-btn" data-cy="submit-button">
            Sign up!
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/login" data-cy="login-link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
