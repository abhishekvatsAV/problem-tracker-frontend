import "./Navbar.css";
import useLogout from "../hooks/useLogout";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout } = useLogout();

  let user = localStorage.getItem("user");
  user = JSON.parse(user);

  const handleClick = () => {
    logout();
  };

  return (
    <nav>
      <a href="/">Home</a>
      <div>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/signup">Signup</Link>}
        {user && <a href="/problems">Problems</a>}
        {user && <a href="/dashboard">Dashboard</a>}
        {user && (
          <a href="/login" onClick={handleClick}>
            Logout
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
