import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, Search } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./Property.css";

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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Property = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { locationName } = useParams();

  const formattedLocation = locationName
    ? locationName
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : "";

  const queryParams = new URLSearchParams(location.search);

  const type = queryParams.get("type") || "";
  const loc = queryParams.get("location") || "";
  const range = queryParams.get("range") || "";
  const search = queryParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allProperties, setAllProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchText, setSearchText] = useState(search);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(
      `${API_BASE}/properties?page=${currentPage}&limit=6${
        locationName
          ? `&location=${encodeURIComponent(formattedLocation)}`
          : loc
          ? `&location=${encodeURIComponent(loc)}`
          : ""
      }${type ? `&type=${encodeURIComponent(type)}` : ""}${
        range ? `&range=${encodeURIComponent(range)}` : ""
      }${search ? `&search=${encodeURIComponent(search)}` : ""}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAllProperties(data.properties || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.log(err));
  }, [currentPage, locationName, formattedLocation, type, range, loc, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [type, range, loc, search]);

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  useEffect(() => {
    fetch(`${API_BASE}/properties?featured=true&limit=4`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProperties((data.properties || []).slice(0, 4));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId: "",
        }),
      });

      if (response.ok) {
        alert("Enquiry Sent Successfully ✅");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert("Something went wrong ❌");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error ❌");
    }

    setSubmitting(false);
  };

  const sortedProperties = [...allProperties].sort(
    (a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0)
  );

  const getVisiblePages = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handleSidebarSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    navigate(`/property?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="property-page-main">
      <Navbar />

      <section className="property-hero-section">
        <div className="property-hero-overlay">
          <motion.div
            className="property-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="property-main-title">
              {search
                ? `Search Results for "${search}"`
                : locationName
                ? `Properties in ${formattedLocation}`
                : "Properties"}
            </h1>

            <nav className="property-breadcrumb-nav">
              <Link to="/">Home</Link>
              <span className="separator">›</span>
              <span>Properties</span>
            </nav>
          </motion.div>
        </div>
      </section>

      <section className="property-list-container">
        <div className="property-content-wrapper">
          <div className="property-left">
            {sortedProperties.length === 0 && (
              <div className="no-results-box">
                No properties found{search ? ` for "${search}"` : ""}.
              </div>
            )}

            {sortedProperties.map((property) => (
              <Link
                key={property._id}
                to={`/property-details/${property.slug ? property.slug : property._id}`}
                className="property-card-link"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="property-card">
                  <div className="property-card-image">
                    {property.premium && (
                      <span className="premium-badge">⭐ Premium</span>
                    )}

                    <img
                      src={
                        property.images && property.images.length > 0
                          ? getImageUrl(property.images[0])
                          : property.image
                          ? getImageUrl(property.image)
                          : getImageUrl("uploads/no-image.jpg")
                      }
                      alt={property.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImageUrl("uploads/no-image.jpg");
                      }}
                    />
                  </div>

                  <div className="property-card-content">
                    <h3>{property.title}</h3>
                    <p className="location">📍 {property.location}</p>

                    <div className="property-features">
                      <span>
                        <Bed size={16} /> {property.bedrooms || 4} Bed
                      </span>
                      <span>
                        <Bath size={16} /> {property.bathrooms || 2} Bath
                      </span>
                      <span>
                        <Maximize size={16} /> {property.sqft || 1500} sqft
                      </span>
                    </div>

                    <div className="property-bottom">
                      <h4 className="property-price">
                        {formatPrice(property.price || property.priceValue)}
                      </h4>

                      <div className="property-buttons">
                        <button
                          className="enquiry-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/contact");
                          }}
                        >
                          Enquiry
                        </button>

                        <span className="view-more-btn">View More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </button>

                {currentPage > 2 && (
                  <>
                    <button
                      className={`page-btn ${currentPage === 1 ? "active" : ""}`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="page-dots">...</span>}
                  </>
                )}

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && (
                      <span className="page-dots">...</span>
                    )}
                    <button
                      className={`page-btn ${
                        currentPage === totalPages ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className="page-btn nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <motion.div className="property-right" variants={fadeUp}>
            <motion.div className="search-box" variants={fadeUp}>
              <h3>Search</h3>
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Enter Keyword"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSidebarSearch();
                    }
                  }}
                />
                <button type="button" onClick={handleSidebarSearch}>
                  <Search size={18} />
                </button>
              </div>
            </motion.div>

            <motion.div className="featured-box" variants={fadeUp}>
              <h3>Featured Listings</h3>
              {featuredProperties.map((property) => (
                <Link
                  key={property._id}
                  to={`/property-details/${property.slug ? property.slug : property._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <motion.div className="featured-item" whileHover={{ x: 5 }}>
                    <img
                      src={
                        property.images && property.images.length > 0
                          ? getImageUrl(property.images[0])
                          : property.image
                          ? getImageUrl(property.image)
                          : getImageUrl("uploads/no-image.jpg")
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImageUrl("uploads/no-image.jpg");
                      }}
                      alt={property.title}
                    />
                    <div>
                      <h4>{property.title}</h4>
                      <p>
                        {property.bedrooms || 4} Bed •{" "}
                        {property.bathrooms || 2} Bath •{" "}
                        {property.sqft || 1500} sqft
                      </p>
                      <span className="featured-price">
                        {formatPrice(property.priceValue || property.price)}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            <motion.div className="contact-form-box" variants={fadeUp}>
              <h3>Contact Us</h3>
              <form>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone"
                  required
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                />

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {submitting ? "Sending..." : "Send Us"}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              className="sidebar-cta-box"
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
            >
              <div className="sidebar-cta-overlay">
                <h3>We can help you to find real estate agency</h3>
                <motion.button
                  className="cta-btn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact With Agent
                </motion.button>
              </div>
            </motion.div>

            <div className="social-box">
              <h3 className="social-title">Social Connections</h3>

              <div className="sidebar-social-no-gap">
                <div className="social-mini-row">
                  {[
                    { icon: "fa-whatsapp", class: "wa", link: "#" },
                    { icon: "fa-instagram", class: "ig", link: "#" },
                    { icon: "fa-facebook-f", class: "fb", link: "#" },
                    { icon: "fa-x-twitter", class: "tw", link: "#" },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      className={`mini-s-btn ${social.class}`}
                      whileHover={{
                        scale: 1.2,
                        rotate: 15,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <i className={`fa-brands ${social.icon}`}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Property;