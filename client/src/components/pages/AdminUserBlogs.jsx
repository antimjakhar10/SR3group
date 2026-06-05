import React, { useEffect, useState } from "react";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./AdminUserBlogs.css";

const AdminUserBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs/admin/user-blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch user blogs error:", error);
      setBlogs([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/blogs/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchBlogs();
    } catch (error) {
      console.error("Update blog status error:", error);
    }
  };

  return (
    <div className="admin-userblogs-container">
      <h2 className="admin-userblogs-title">User Blogs Approval</h2>

      <div className="admin-userblogs-table-wrapper">
        <div className="admin-userblogs-table-scroll">
          <table className="admin-userblogs-table">
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
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img
                      src={getImageUrl(blog.image)}
                      alt="blog"
                      className="admin-userblogs-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImageUrl("uploads/no-image.jpg");
                      }}
                    />
                  </td>

                  <td className="admin-userblogs-title-cell">{blog.title}</td>

                  <td>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={`admin-userblogs-status-badge ${String(
                        blog.approvalStatus || ""
                      ).toLowerCase()}`}
                    >
                      {blog.approvalStatus}
                    </span>
                  </td>

                  <td>
                    <div className="admin-userblogs-action-buttons">
                      <button
                        className="admin-userblogs-approve-btn"
                        onClick={() => updateStatus(blog._id, "Approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="admin-userblogs-reject-btn"
                        onClick={() => updateStatus(blog._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
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

export default AdminUserBlogs;