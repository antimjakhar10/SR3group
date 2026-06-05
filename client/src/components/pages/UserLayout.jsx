import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./UserLayout.css";

const UserLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/user/login");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div className="user-layout">
      <button className="user-layout-hamburger" onClick={() => setOpen(true)}>
        ☰
      </button>

      {open && <div className="backdrop" onClick={() => setOpen(false)}></div>}

      <div className={`sidebar ${open ? "active" : ""}`}>
        <h2>User Panel</h2>

        <Link to="/user/dashboard" onClick={() => setOpen(false)}>
          Dashboard
        </Link>
        <Link to="/user/add-property" onClick={() => setOpen(false)}>
          Add Property
        </Link>
        <Link to="/user/my-properties" onClick={() => setOpen(false)}>
          My Properties
        </Link>
        <Link to="/user/user-add-blog" onClick={() => setOpen(false)}>
          Add Blog
        </Link>
        <Link to="/user/my-blogs" onClick={() => setOpen(false)}>
          My Blogs
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;