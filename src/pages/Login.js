import React, { useEffect, useState } from "react";
import useLogin from "../hooks/useLogin";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn, isLoading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logIn(email, password);
    let user = localStorage.getItem("user");
    if (user) {
      // setUser(user);
      console.log("first");
      navigate("/home");
    }
  };
  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <h3>Login</h3>
      <label htmlFor="">Email: </label>
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
      <button className="btn" disabled={isLoading}>
        Login
      </button>
      {error && <div className="loginError">{error}</div>}
    </form>
  );
};

export default Login;
