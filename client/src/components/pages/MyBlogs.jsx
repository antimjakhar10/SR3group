import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./MyBlogs.css";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    fetch(`${API_BASE}/blogs/user/${user._id}`)
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Fetch my blogs error:", error);
        setBlogs([]);
      });
  }, [user?._id]);

  return (
    <div className="myblogs-container">
      <h2 className="myblogs-title">My Blogs</h2>

      <div className="myblogs-table-wrapper">
        <div className="table-scroll">
          <table className="myblogs-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img
                      src={getImageUrl(b.image)}
                      alt="blog"
                      className="blog-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://dummyimage.com/80x60/ccc/000&text=No+Image";
                      }}
                    />
                  </td>

                  <td className="blog-title">{b.title}</td>

                  <td>
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${b.approvalStatus?.toLowerCase()}`}
                    >
                      {b.approvalStatus}
                    </span>
                  </td>

                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/user/edit-blog/${b._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="view-btn"
                      onClick={() => navigate(`/blog-details/${b._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;