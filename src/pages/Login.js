import React, { useState } from "react";
import useLogin from "../hooks/useLogin";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn, isLoading, error, setError } = useLogin();
  const navigate = useNavigate();

  const closeError = () => {
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logIn(email, password);
    let user = localStorage.getItem("user");
    if (user) {
      navigate("/home");
    }
  };
  return (
    <div className="loginPage">
      <div className="loginLogo">
        <img
          src="https://res.cloudinary.com/dudoss6ih/image/upload/v1668326337/IMG_20210727_173654_kta1jy.jpg"
          alt=""
        />
      </div>

      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>
          Login to <span>PT</span>
        </h1>
        <div className="loginBody">
          <label htmlFor="">Email address </label>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required={true}
          />
          <label htmlFor="">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required={true}
          />
          <button className="loginBtn" disabled={isLoading}>
            Login
          </button>
        </div>
        {error && (
          <div className="loginError">
            {error}
            <CloseOutlined className="loginErrBtn" onClick={closeError} />
          </div>
        )}

        <div className="logintoReg">
          <p>
            New to PT? <Link to="/signup">Create an account</Link>.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
