import React, { useEffect, useState } from "react";
import { API_BASE } from "../../utils/api";
import "./UserDashboard.css";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [properties, setProperties] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    fetch(`${API_BASE}/properties/user/${user._id}`)
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []))
      .catch((error) => {
        console.error("Fetch user properties error:", error);
        setProperties([]);
      });

    fetch(`${API_BASE}/blogs/user/${user._id}`)
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Fetch user blogs error:", error);
        setBlogs([]);
      });
  }, [user?._id]);

  return (
    <div className="dashboard-main">
      <h2 className="dashboard-title">User Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Properties</p>
            <h3>{properties.length}</h3>
          </div>
          <div className="stat-icon">🏠</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Total Blogs</p>
            <h3>{blogs.length}</h3>
          </div>
          <div className="stat-icon">📝</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;