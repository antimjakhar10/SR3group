import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SearchSection.css";

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [price, setPrice] = useState(5000000);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    range: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const containerVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="search-section pro compact"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="search-container" variants={itemVariant}>
        <div className="tabs">
          {["Buy", "Sell"].map((tab) => (
            <motion.button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <div className="form-grid">
          <motion.div className="form-group" variants={itemVariant}>
            <label>Property Type</label>
            <select name="type" onChange={handleChange}>
              <option value="">Select Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Land Or Plot">Land Or Plot</option>
              <option value="Farm">Farm</option>
            </select>
          </motion.div>

          <motion.div className="form-group" variants={itemVariant}>
            <label>Location</label>
            <select name="location" onChange={handleChange}>
              <option value="">Select Location</option>
              <option value="Rohtak">Rohtak</option>
              <option value="Delhi">Delhi</option>
              <option value="Sonipat">Sonipat</option>
              <option value="Gurgaon">Gurgaon</option>
            </select>
          </motion.div>

          <motion.div className="form-group price-group" variants={itemVariant}>
            <label>Price Range</label>
            <input
              type="range"
              min="5000000"
              max="100000000"
              step="500000"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setFilters({
                  ...filters,
                  range: e.target.value,
                });
              }}
            />
            <div className="price-values">
              <span>₹50,00,000</span>
              <span className="current-price">
                ₹{Number(price).toLocaleString("en-IN")}
              </span>
              <span>₹10,00,00,000</span>
            </div>
          </motion.div>

          <motion.div className="search-btn-wrap" variants={itemVariant}>
            <motion.button
              className="search-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const query = new URLSearchParams({
                  ...(filters.location && { location: filters.location }),
                  ...(filters.type && { type: filters.type }),
                  ...(filters.range && { range: filters.range }),
                }).toString();

                navigate(`/property${query ? `?${query}` : ""}`);
              }}
            >
              Search
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SearchSection;