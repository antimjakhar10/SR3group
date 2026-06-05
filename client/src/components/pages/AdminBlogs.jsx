import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./AdminBlogs.css";

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs/admin/blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch blogs error:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/blogs/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchBlogs();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      } else {
        alert("Failed to delete blog ❌");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="admin-blogs-container">
      <h2 className="admin-blogs-title">All Blogs</h2>

      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="admin-blogs-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img
                      src={getImageUrl(blog.image)}
                      alt="blog"
                      className="blog-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImageUrl("uploads/no-image.jpg");
                      }}
                    />
                  </td>

                  <td>{blog.title}</td>

                  <td>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteBlog(blog._id)}
                    >
                      Delete
                    </button>
                  </td>

                  <td>
                    <select
                      value={blog.approvalStatus}
                      onChange={(e) => updateStatus(blog._id, e.target.value)}
                      className={`status-select ${String(
                        blog.approvalStatus || ""
                      ).toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
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

export default AdminBlogs;