import React, { useState } from "react";
import useLogin from "../hooks/useLogin";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined } from "@ant-design/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn, isLoading, error, setError } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGuestLogin = () => {
    setEmail("guest@example.com");
    setPassword("Abc@1234");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
          <div className="w-full flex relative">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required={true}
              className="w-full pr-4"
            />
            <div className="absolute right-2">
              {showPassword ? (
                <EyeOutlined onClick={handleShowPassword} />
              ) : (
                <EyeInvisibleOutlined onClick={handleShowPassword} />
              )}
            </div>
          </div>

          <button className="loginBtn" disabled={isLoading}>
            Login
          </button>
          <button
            className="loginBtn mt-3 !bg-green-500 !opacity-90 hover:!opacity-100"
            onClick={handleGuestLogin}
          >
            Login as Guest
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
