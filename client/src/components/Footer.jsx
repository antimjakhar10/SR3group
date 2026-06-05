import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-col about">
          <h4>
            <Link to="/about">About SR3 Group</Link>
          </h4>

          <p className="about-text">
            SR3 Group is a trusted real estate platform helping buyers,
            sellers, and investors discover premium properties with confidence,
            transparency, and a hassle-free experience.
          </p>

          <div className="contact-details">
            <p>
              <span>✉</span> admin@sr3group.com
            </p>
            <p>
              <span>📍</span> Rohtak, Haryana
            </p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Featured Houses</h4>
          <ul>
            <li>
              <Link to="/property?type=villa">
                <span className="red-icon">🏠</span> Villa
              </Link>
            </li>
            <li>
              <Link to="/property?type=commercial">
                <span className="red-icon">🏠</span> Commercial
              </Link>
            </li>
            <li>
              <Link to="/property?type=farmhouse">
                <span className="red-icon">🏠</span> Farm Houses
              </Link>
            </li>
            <li>
              <Link to="/property?type=apartment">
                <span className="red-icon">🏠</span> Apartments
              </Link>
            </li>
            <li>
              <Link to="/property?type=land">
                <span className="red-icon">🏠</span> Land / Plots
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">
                <span className="red-icon">🏠</span> Home
              </Link>
            </li>
            <li>
              <Link to="/property">
                <span className="red-icon">🏠</span> Property
              </Link>
            </li>
            <li>
              <Link to="/blog">
                <span className="red-icon">🏠</span> Blog
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <span className="red-icon">🏠</span> Contact Us
              </Link>
            </li>
            <li>
              <Link to="/location/delhi">
                <span className="red-icon">🏠</span> Location
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col map-col">
          <h4>SR3 Group Location</h4>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps?q=Dwarka+Delhi&output=embed"
              width="100%"
              height="150"
              style={{ border: 0, borderRadius: "10px" }}
              loading="lazy"
              title="SR3 Group Location"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-copyright-row">
        <p className="copy-text">
          Copyright © 2026 SR3 Group. All Rights Reserved.
        </p>

        <div className="social-links-flex">
          <motion.a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="social-circle"
            whileHover={{ backgroundColor: "#ff4d4d", color: "#fff" }}
          >
            <FaFacebookF />
          </motion.a>

          <motion.a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="social-circle"
            whileHover={{ backgroundColor: "#ff4d4d", color: "#fff" }}
          >
            <FaTwitter />
          </motion.a>

          <motion.a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="social-circle"
            whileHover={{ backgroundColor: "#ff4d4d", color: "#fff" }}
          >
            <FaLinkedinIn />
          </motion.a>

          <motion.a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="social-circle"
            whileHover={{ backgroundColor: "#ff4d4d", color: "#fff" }}
          >
            <FaWhatsapp />
          </motion.a>
        </div>
      </div>

      <motion.div
        className="fixed-scroll-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </motion.div>
    </footer>
  );
};

export default Footer;