import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./PropertyDetails.css";

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

const PropertyDetails = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/properties/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPropertyData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (propertyData?.images?.length > 0) {
      setSelectedImage(getImageUrl(propertyData.images[0]));
    } else if (propertyData?.image) {
      setSelectedImage(getImageUrl(propertyData.image));
    }
  }, [propertyData]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!propertyData) {
    return <h2 style={{ textAlign: "center" }}>Property Not Found</h2>;
  }

  const imagesArray =
    propertyData?.images && propertyData.images.length > 0
      ? propertyData.images.map((img) => getImageUrl(img))
      : propertyData?.image
      ? [getImageUrl(propertyData.image)]
      : [getImageUrl("uploads/no-image.jpg")];

  const mediaItems = imagesArray.map((img) => ({
    type: "image",
    src: img,
  }));

  const highlights = [
    {
      icon: "fa-tag",
      label: "ID NO.",
      value: propertyData._id?.slice(-6) || "N/A",
    },
    { icon: "fa-house", label: "Type", value: propertyData.type || "N/A" },
    { icon: "fa-door-open", label: "Room", value: propertyData.bedrooms || 0 },
    { icon: "fa-bed", label: "Bedroom", value: propertyData.bedrooms || 0 },
    { icon: "fa-bath", label: "Bath", value: propertyData.bathrooms || 0 },
    {
      icon: "fa-house-circle-check",
      label: "Purpose",
      value: propertyData.status || "For Sale",
    },
    { icon: "fa-ruler-combined", label: "Sqft", value: propertyData.sqft || 0 },
    { icon: "fa-car", label: "Parking", value: propertyData.parking || "No" },
    { icon: "fa-elevator", label: "Elevator", value: "Yes" },
    { icon: "fa-wifi", label: "Wifi", value: "Yes" },
    {
      icon: "fa-calendar-days",
      label: "Built in",
      value: propertyData.yearBuilt || "N/A",
    },
  ];

  let amenities = [];

  if (propertyData.amenities) {
    if (Array.isArray(propertyData.amenities)) {
      amenities = propertyData.amenities;
    } else if (typeof propertyData.amenities === "string") {
      try {
        const cleaned = propertyData.amenities.trim();
        amenities = JSON.parse(cleaned);
      } catch (error) {
        amenities = propertyData.amenities
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((item) => item.trim());
      }
    }
  }

  let nearbyLocations = [];

  if (Array.isArray(propertyData?.nearbyLocations)) {
    nearbyLocations = propertyData.nearbyLocations
      .filter((place) => place && place.name)
      .map((place) => ({
        name: place.name,
        dist: place.dist || "",
        icon: "fa-location-dot",
      }));
  }

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
          propertyId: propertyData._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
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

  return (
    <div className="property-details-page">
      <Helmet>
        <title>
          {propertyData?.seoTitle || propertyData?.title || "Property"}
        </title>

        <meta
          name="description"
          content={propertyData?.seoDescription || propertyData?.description || ""}
        />

        <meta
          name="keywords"
          content={propertyData?.seoKeywords || "real estate, property"}
        />

        <link rel="icon" href="/R3developer.png" />
      </Helmet>

      <Navbar />

      <section className="pd-hero-section">
        <div className="pd-hero-overlay">
          <motion.div
            className="pd-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{propertyData.title}</h1>

            <div className="pd-breadcrumb">
              <Link to="/">Home</Link>
              <span className="separator">›</span>
              <span className="active-page">{propertyData.title}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pd-view-section">
        <div className="container">
          <div className="pd-view-grid">
            <div className="pd-view-left">
              <div className="pd-main-display">
                {selectedImage &&
                  (selectedImage.endsWith(".mp4") ? (
                    <video
                      src={selectedImage}
                      controls
                      className="pd-featured-img"
                    />
                  ) : (
                    <img
                      src={selectedImage}
                      alt="Property"
                      className="pd-featured-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImageUrl("uploads/no-image.jpg");
                      }}
                    />
                  ))}
              </div>

              <div className="pd-thumbnails-row">
                {mediaItems.map((item, index) => (
                  <div
                    key={index}
                    className={`pd-thumb ${
                      item.src === selectedImage ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(item.src)}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        alt="thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getImageUrl("uploads/no-image.jpg");
                        }}
                      />
                    ) : (
                      <div className="video-thumb">
                        <video src={item.src} />
                        <div className="play-icon">▶</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pd-about-property-info">
                <div className="pd-info-top-tags">
                  <div className="pd-left-tags">
                    <span className="featured-badge">Featured</span>
                    <span className="info-tag">
                      <i className="fa-regular fa-calendar"></i>{" "}
                      {propertyData.yearBuilt || "2024"}
                    </span>
                    <span className="info-tag">
                      <i className="fa-regular fa-comment"></i> No Comments
                    </span>
                  </div>
                  <div className="pd-wishlist-icon">
                    <i className="fa-regular fa-heart"></i>
                  </div>
                </div>

                <div className="pd-title-price-row">
                  <h2>About This Property</h2>
                  <span className="pd-price-val">
                    {formatPrice(propertyData.price || propertyData.priceValue)}
                  </span>
                </div>

                <div className="pd-location-specs-bar">
                  <div className="pd-loc">
                    <i className="fa-solid fa-location-dot"></i>{" "}
                    {propertyData.location}
                  </div>
                  <div className="pd-specs">
                    <span>
                      <i className="fa-solid fa-bed"></i> Bed{" "}
                      {propertyData.bedrooms || 0}
                    </span>
                    <span className="spec-sep">|</span>
                    <span>
                      <i className="fa-solid fa-bath"></i> Bath{" "}
                      {propertyData.bathrooms || 0}
                    </span>
                    <span className="spec-sep">|</span>
                    <span>
                      <i className="fa-solid fa-vector-square"></i>{" "}
                      {propertyData.sqft || 0} sqft
                    </span>
                  </div>
                </div>

                <div className="pd-main-desc">
                  <div
                    className="pd-desc-richtext ql-editor"
                    dangerouslySetInnerHTML={{ __html: propertyData.description || "" }}
                  />
                </div>
              </div>
            </div>

            <div className="pd-contact-sidebar">
              <div className="custom-contact-card">
                <h2>Contact Us</h2>
                <form className="custom-form">
                  <div className="custom-input-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="custom-input-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="custom-input-group">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your Phone"
                      required
                    />
                  </div>
                  <div className="custom-input-group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows="6"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    className="custom-send-btn"
                    disabled={submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Sending..." : "Send Us"}
                  </button>
                </form>
              </div>

              <motion.div
                className="sidebar-agency-banner"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="agency-banner-overlay">
                  <h3>We can help you to find real estate agency</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="agency-contact-btn"
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
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <i className={`fa-brands ${social.icon}`}></i>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pd-highlights-section">
        <div className="pd-highlights-header-new">
          <h2 className="pd-main-heading">Property Highlights</h2>
        </div>

        <div className="pd-highlights-wrapper">
          <div className="pd-highlights-card">
            <div className="sale-status-new">
              <span className="dot"></span> {propertyData.type} for sale
            </div>

            <div className="pd-highlights-grid">
              {highlights.map((item, index) => (
                <div className="highlight-item" key={index}>
                  <div className="highlight-icon">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <div className="highlight-text">
                    <span>{item.label}</span>
                    <h4>{item.value}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-nearby-card-new">
            <h3>Nearby Locations</h3>

            <div className="nearby-list-new">
              {nearbyLocations.map((loc, i) => (
                <div className="nearby-item-new" key={i}>
                  <div className="nearby-icon">
                    <i className={`fa-solid ${loc.icon}`}></i>
                  </div>
                  <div>
                    <h5>{loc.name}</h5>
                    <p>{loc.dist ? `${loc.dist} away` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pd-modern-gallery-container">
        <div className="pd-gallery-title-row">
          <h2>From Amazing Gallery</h2>
        </div>

        <div className="pd-asymmetric-grid">
          <div className="pg-tile-new span-2">
            <img
              src={imagesArray[0]}
              alt="Main View"
              onClick={() => setPreviewImage(imagesArray[0])}
            />
            <div className="pg-badge">Main View</div>
          </div>

          {imagesArray[1] && (
            <div className="pg-tile-new">
              <img
                src={imagesArray[1]}
                alt="Second View"
                onClick={() => setPreviewImage(imagesArray[1])}
              />
            </div>
          )}

          {imagesArray.slice(2).map((img, index) => (
            <div className="pg-tile-new" key={index}>
              <img
                src={img}
                alt={`Gallery ${index}`}
                onClick={() => setPreviewImage(img)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pd-amenities-card-wrapper">
        <div className="pd-amenities-content">
          <h2 className="section-title-main">Features & amenities</h2>

          <div className="pd-amenities-list-grid">
            {amenities.map((item, index) => (
              <div key={index} className="amenity-list-item">
                <div className="custom-checkbox-box">
                  <i className="fa-solid fa-check"></i>
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pd-location-card-wrapper">
        <div className="pd-location-content">
          <h2 className="section-title-main">Location</h2>

          <div className="pd-map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Property Location"
            ></iframe>

            <div className="map-info-floating-card">
              <div className="info-card-img">
                <img
                  src={imagesArray[0]}
                  alt="Prop"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImageUrl("uploads/no-image.jpg");
                  }}
                />
              </div>
              <div className="info-card-details">
                <p>
                  <strong>Address:</strong>
                  <br />
                  {propertyData.location}
                </p>
              </div>
            </div>

            <div className="map-zoom-controls">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  propertyData.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-larger-btn"
                style={{ textDecoration: "none" }}
              >
                View larger map
              </a>
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <div className="lightbox-overlay" onClick={() => setPreviewImage(null)}>
          <div className="lightbox-content">
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetails;