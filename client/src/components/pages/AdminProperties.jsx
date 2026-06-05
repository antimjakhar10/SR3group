import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyListLayout from "./PropertyListLayout";
import { API_BASE } from "../../utils/api";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE}/properties/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setProperties(data);
      } else if (Array.isArray(data.properties)) {
        setProperties(data.properties);
      } else if (Array.isArray(data.data)) {
        setProperties(data.data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Fetch admin properties error:", error);
      setProperties([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await fetch(`${API_BASE}/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete property error:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-property/${id}`, {
      state: { from: "admin" },
    });
  };

  const handleTogglePremium = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${API_BASE}/properties/toggle-premium/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      setProperties((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, premium: data.premium } : p
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateApproval = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/properties/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Update failed");
        return;
      }

      fetchProperties();
    } catch (error) {
      console.error("Update approval error:", error);
    }
  };

  const handleExportCSV = () => {
    if (!properties.length) {
      alert("No properties to export");
      return;
    }

    const headers = [
      "ID",
      "Title",
      "Location",
      "Type",
      "Price",
      "Area (sqft)",
      "Approval Status",
      "Created Date",
    ];

    const rows = properties.map((p, index) => [
      `PR-${1000 + index}`,
      p.title || "",
      p.location || "",
      p.type || "",
      p.price || "",
      p.sqft || "",
      p.approvalStatus || "",
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "properties_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "600" }}>🏠 Properties</h2>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Manage all listed properties
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleExportCSV}
            style={{
              padding: "10px 18px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
            }}
          >
            Export CSV
          </button>

          <button
            onClick={() => navigate("/admin/add-property")}
            style={{
              padding: "10px 18px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            + Add Property
          </button>
        </div>
      </div>

      <PropertyListLayout
        properties={properties}
        showActions={true}
        showApproval={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePremium={handleTogglePremium}
        onUpdateApproval={handleUpdateApproval}
      />
    </div>
  );
};

export default AdminProperties;