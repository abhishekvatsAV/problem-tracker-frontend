import "./Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <a href="/">Home</a>
      <div>
        <a href="/problems">Problems</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </nav>
  );
};

export default Navbar;
