import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "instructor" ? "/instructor" : "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link className="brand" to="/" aria-label="LearnHub home">
          <span className="brand-mark">L</span><span>Learn<span className="brand-accent">Hub</span></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          {user && <NavLink to={dashboardPath}>Dashboard</NavLink>}
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">{user.name.split(" ")[0]} <small>{user.role}</small></span>
              <button className="btn btn-ghost btn-small" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login">Log in</Link>
              <Link className="btn btn-primary btn-small" to="/register">Get started <span>↗</span></Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
