import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { API_BASE } from "../../utils/api";
import "./Contactus.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE}/contact`, formData);

      alert(res.data.message);

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response Data:", error.response?.data);
      alert(error.response?.data?.message || "Error sending message");
    }
  };

  return (
    <div className="contact-page-main">
      <Navbar />

      <section className="contact-hero-section">
        <div className="contact-hero-overlay">
          <motion.div
            className="contact-hero-content"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <h1>Contact</h1>
            <div className="contact-breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span className="active">Contact With Us</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="contact-info-section">
        <motion.div
          className="container info-grid-wrapper"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="info-card-custom" variants={fadeUp}>
            <div className="icon-sphere-white">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="info-content-text">
              <h4>Address</h4>
              <p>Rohtak, Haryana</p>
            </div>
          </motion.div>

          <motion.div className="info-card-custom" variants={fadeUp}>
            <div className="icon-sphere-white">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="info-content-text">
              <h4>Phone Number</h4>
              <p>+91 1234567890</p>
            </div>
          </motion.div>

          <motion.div className="info-card-custom" variants={fadeUp}>
            <div className="icon-sphere-white">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="info-content-text">
              <h4>Email Address</h4>
              <p>admin@sr3group.com</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="contact-form-main-section">
        <div className="container form-flex-wrapper">
          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Do you have questions? Contact Us</h2>
            <form className="main-contact-form" onSubmit={handleSubmit}>
              <div className="input-row">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name *"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone *"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                required
              />

              <select
                className="subject-select"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select Subject</option>
                <option value="property">Property Inquiry</option>
                <option value="agent">Speak to Agent</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message *"
                rows="6"
                required
              ></textarea>

              <button type="submit" className="send-message-btn">
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            className="contact-image-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800"
              alt="Real Estate Agent"
              className="agent-img"
            />
          </motion.div>
        </div>
      </section>

      <motion.section
        className="contact-map-wrapper"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <iframe
          src="https://www.google.com/maps?q=Dwarka+Delhi&output=embed"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        ></iframe>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Contact;