import "./Navbar.css";
import useLogout from "../hooks/useLogout";
import { LogoutOutlined } from "@ant-design/icons";

const Navbar = () => {
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <nav>
      <div className="navbarSec1">
        <a href="/">
          <img
            src="https://res.cloudinary.com/dudoss6ih/image/upload/v1668326337/IMG_20210727_173654_kta1jy.jpg"
            alt=""
            className="logo"
          />
        </a>
        <a href="/problems">Problems</a>
        <a href="/dashboard">Dashboard</a>
      </div>
      <div>
        <a href="/login" onClick={handleClick}>
          <LogoutOutlined />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
