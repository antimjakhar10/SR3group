import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./BestProperties.css";
import { API_BASE } from "../utils/api";
import { getImageUrl } from "../utils/imageHelper";

const formatPrice = (price) => {
  if (!price) return "₹0";

  if (typeof price === "string") {
    return `₹${price}`;
  }

  if (!isNaN(price)) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  }

  return "₹0";
};

const BestProperties = () => {
  const [activeTab, setActiveTab] = useState("View All");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/properties?best=true&limit=8`)
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const categories = [
    "View All",
    "Apartment",
    "Commercial",
    "Land Or Plot",
    "Farm",
  ];

  const filteredProperties =
    activeTab === "View All"
      ? properties
      : properties.filter((property) => {
          const backendValue =
            property.category?.toLowerCase().trim() ||
            property.type?.toLowerCase().trim();

          const tabValue = activeTab.toLowerCase().trim();

          if (tabValue === "land or plot") {
            return (
              backendValue === "land" ||
              backendValue === "plot" ||
              backendValue === "land or plot"
            );
          }

          return backendValue === tabValue;
        });

  return (
    <section className="best-properties">
      <div className="container">
        <p className="subtitle">— Popular Properties —</p>
        <h2 className="section-title">Best Properties Sale</h2>

        <div className="filter-buttons-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="property-grid">
          {filteredProperties.map((property, index) => {
            const detailUrl = `/property-details/${property.slug ? property.slug : property._id}`;

            return (
              <motion.div
                className="property-card"
                key={property._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                }}
              >
                <Link to={detailUrl} className="image-wrapper">
                  <img
                    src={getImageUrl(property.images?.[0] || property.image)}
                    alt={property.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getImageUrl("uploads/no-image.jpg");
                    }}
                  />
                  <span className="badge">For Sale</span>
                </Link>

                <div className="card-content">
                  <Link
                    to={detailUrl}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3>{property.title}</h3>
                  </Link>

                  <p className="location">{property.location}</p>

                  <div className="card-bottom">
                    <span className="price">{formatPrice(property.price)}</span>

                    <div className="btn-group">
                      <a
                        href={`https://wa.me/919999999999?text=Hello I am interested in ${property.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="query-btn"
                      >
                        <FaWhatsapp />
                      </a>

                      <Link to={detailUrl} className="view-btn-link">
                        View More
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestProperties;