import { useState } from "react";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(true);
  const { signup, isLoading, error } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMatch(false);
    } else {
      setMatch(true);
      await signup(email, password);
      let user = localStorage.getItem("user");
      if (user) {
        navigate("/");
      }
    }
  };

  return (
    <form className="signUpForm" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
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
      <label htmlFor="">Confirm Password</label>
      <input
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        required={true}
      />
      {!match && <>Password Doesnot match</>}
      <button className="btn" disabled={isLoading}>
        SignUp
      </button>
      {error && <div className="signupError">{error}</div>}
    </form>
  );
};

export default Signup;
