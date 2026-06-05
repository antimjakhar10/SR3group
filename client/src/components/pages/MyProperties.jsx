import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import "./MyProperties.css";

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

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) {
      console.log("User not found ❌");
      return;
    }

    fetch(`${API_BASE}/properties/user/${user._id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("API failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("DATA:", data);
        setProperties(data.properties || []);
      })
      .catch((err) => {
        console.error("ERROR:", err);
      });
  }, [user?._id]);

  return (
    <div className="my-properties">
      <h2>My Properties</h2>

      <div className="property-list">
        {properties.map((p) => (
          <div key={p._id} className="property-row">
            <div className="col title">
              <h4>{p.title}</h4>
              <p>{p.location}</p>
            </div>

            <div className="col">{formatPrice(p.price)}</div>

            <div className="col">{p.type}</div>

            <div className="col">
              <span
                className={`status-badge ${
                  p.approvalStatus === "Approved"
                    ? "status-approved"
                    : p.approvalStatus === "Rejected"
                    ? "status-rejected"
                    : "status-pending"
                }`}
              >
                {p.approvalStatus}
              </span>
            </div>

            <div className="col actions">
              <button
                className="btn btn-edit"
                onClick={() => navigate(`/user/edit-property/${p._id}`)}
              >
                Edit
              </button>

              <button
                className="btn btn-view"
                onClick={() => navigate(`/property-details/${p.slug || p._id}`)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties;