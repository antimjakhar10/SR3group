import React, { useEffect, useState } from "react";
import { Bed, Bath, Maximize2 } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./PropertyGrid.css";

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

export default function PropertyGrid() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/properties/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API DATA:", res.data);

      if (Array.isArray(res.data)) {
        setProperties(res.data);
      } else if (Array.isArray(res.data.properties)) {
        setProperties(res.data.properties);
      } else {
        setProperties([]);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const resolveImage = (images, image) => {
    let finalImage = null;

    if (images && images.length > 0) {
      finalImage = images[0];
    } else if (image) {
      finalImage = image;
    }

    return getImageUrl(finalImage || "uploads/no-image.jpg");
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="grid-container">
      {properties.map((p) => (
        <div key={p._id} className="grid-card">
          <img
            src={resolveImage(p.images, p.image)}
            alt={p.title}
            className="grid-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getImageUrl("uploads/no-image.jpg");
            }}
          />

          <div className="grid-card-body">
            <h3 className="grid-price">{formatPrice(p.price)}</h3>

            <h4 className="grid-title">{p.title}</h4>

            <p className="grid-location">{p.location}</p>

            <div className="grid-meta">
              <span>
                <Bed size={16} /> {p.bedrooms || 0}
              </span>

              <span>
                <Bath size={16} /> {p.bathrooms || 0}
              </span>

              <span>
                <Maximize2 size={16} /> {p.sqft || 0} sqft
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}