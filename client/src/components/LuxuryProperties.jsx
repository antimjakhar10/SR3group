import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import "./LuxuryProperties.css";
import { Link } from "react-router-dom";
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

const LuxuryProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/properties?luxury=true&limit=4`)
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const luxuryProperties = Array.isArray(properties) ? properties : [];

  return (
    <section className="luxury-properties">
      <div className="container">
        <motion.div
          className="header-wrapper"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="subtitle">— Listing Properties —</p>
          <h2 className="section-title">Featured Luxury Properties</h2>
        </motion.div>

        <div className="property-grid">
          {luxuryProperties?.map((property, index) => (
            <motion.div
              className="property-card"
              key={property._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              }}
            >
              <Link
                to={`/property-details/${property.slug ? property.slug : property._id}`}
                className="image-wrapper"
              >
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
                  to={`/property-details/${property.slug ? property.slug : property._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3>{property.title}</h3>
                </Link>

                <p className="location">{property.location}</p>

                <div className="card-bottom">
                  <span className="price">{formatPrice(property.price)}</span>

                  <div className="btn-group">
                    <motion.a
                      href={`https://wa.me/919999999999?text=Hello I am interested in ${property.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="query-btn"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaWhatsapp />
                    </motion.a>

                    <Link
                      to={`/property-details/${property.slug ? property.slug : property._id}`}
                      className="view-btn-link"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      View More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryProperties;