import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import "./AdminUserProperties.css";

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") return "₹0";

  if (typeof price === "number") {
    return `₹${price.toLocaleString("en-IN")}`;
  }

  if (typeof price === "string") {
    const trimmed = price.trim();

    if (!trimmed) return "₹0";

    const numericValue = Number(trimmed.replace(/,/g, ""));

    if (!isNaN(numericValue)) {
      return `₹${numericValue.toLocaleString("en-IN")}`;
    }

    return `₹${trimmed}`;
  }

  return "₹0";
};

const AdminUserProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE}/properties/admin/user-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error("Fetch user properties error:", error);
      setProperties([]);
    }
  };

  const updateApproval = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await fetch(`${API_BASE}/properties/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      fetchData();
    } catch (error) {
      console.error("Update approval error:", error);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete property?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await fetch(`${API_BASE}/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchData();
    } catch (error) {
      console.error("Delete property error:", error);
    }
  };

  const togglePremium = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE}/properties/toggle-premium/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Toggle failed:", data);
        return;
      }

      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, premium: data.premium } : p))
      );
    } catch (err) {
      console.error("Frontend error:", err);
    }
  };

  return (
    <div className="admin-user-properties">
      <div className="header">
        <div>
          <h2>👤 User Properties</h2>
          <p>Users Post Properties</p>
        </div>
        <div className="count">Showing {properties.length} properties</div>
      </div>

      <div className="table-container">
        <div className="table-scroll">
          <table className="property-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Area</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td className="id">
                    {p.propertyId || "PR-" + p._id.slice(-4)}
                  </td>

                  <td className="title">{p.title}</td>

                  <td className="location">{p.location}</td>

                  <td>
                    <span className="type">{p.type}</span>
                  </td>

                  <td className="price">{formatPrice(p.price)}</td>

                  <td>{p.sqft} sqft</td>

                  <td>
                    <span className={`status ${p.approvalStatus?.toLowerCase()}`}>
                      {p.approvalStatus}
                    </span>
                  </td>

                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/admin/edit-property/${p._id}`, {
                            state: { from: "user" },
                          })
                        }
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteProperty(p._id)}
                      >
                        🗑
                      </button>

                      <select
                        className="approval-select"
                        value={p.approvalStatus}
                        onChange={(e) => updateApproval(p._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        className={`star-btn ${p.premium ? "active" : ""}`}
                        onClick={() => togglePremium(p._id)}
                      >
                        ⭐
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

export default AdminUserProperties;