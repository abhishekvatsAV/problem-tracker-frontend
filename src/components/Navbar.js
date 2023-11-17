import "./Navbar.css";
import useLogout from "../hooks/useLogout";
import { LogoutOutlined } from "@ant-design/icons";

const Navbar = () => {
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <nav className="relative flex justify-between items-center">
      <div className="flex items-center">
        <a href="/" >
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
        <a href="/login" onClick={handleClick} className="flex items-center text-3xl">
          <LogoutOutlined />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
