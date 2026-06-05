import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaSearch,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa";
import "./Navbar.css";
import logo from "../assets/SR3logo.png";

const Navbar = ({ variant }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUserLoginClick = () => {
    const token = localStorage.getItem("userToken");

    if (token) {
      navigate("/user/dashboard");
    } else {
      navigate("/user/login");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = searchText.trim();
    if (!trimmed) return;

    setMenuOpen(false);
    setSearchOpen(false);
    navigate(`/property?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div className={`topbar ${scrolled ? "hide" : ""}`}>
        <div className="top-left">
          <span>
            <FaEnvelope /> admin@sr3group.com
          </span>
        </div>

        <div className="top-right">
          <a href="#" target="_blank" rel="noreferrer">
            <FaFacebookF />
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <FaLinkedinIn />
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            <FaWhatsapp />
          </a>

          <span className="language">English</span>
        </div>
      </div>

      <nav
        className={`navbar ${
          scrolled ? "scrolled" : ""
        } ${variant === "solid" ? "solid-nav" : ""}`}
      >
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="SR3 Group" className="logo-img" />
          </Link>
        </div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          
          <li>
            <Link to="/property" onClick={handleLinkClick}>
              Property
            </Link>
          </li>
          <li>
            <Link to="/blog" onClick={handleLinkClick}>
              Blog
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={handleLinkClick}>
              Contact Us
            </Link>
          </li>

          <li className="nav-item dropdown-item">
            <span className="location-trigger">
              Location <i className="fa-solid fa-chevron-down"></i>
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/location/rohtak" onClick={handleLinkClick}>
                  Rohtak
                </Link>
              </li>
              <li>
                <Link to="/location/sonipat" onClick={handleLinkClick}>
                  Sonipat
                </Link>
              </li>
              <li>
                <Link to="/location/delhi" onClick={handleLinkClick}>
                  Delhi
                </Link>
              </li>
              <li>
                <Link to="/location/gurgaon" onClick={handleLinkClick}>
                  Gurgaon
                </Link>
              </li>
            </ul>
          </li>

          <li className="mobile-search-block">
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search property, location, keyword..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>
          </li>

          <li className="mobile-buttons">
            <button
              className="btn post-property"
              onClick={() => {
                setMenuOpen(false);
                navigate("/post-property");
              }}
            >
              Post Free Property
            </button>

            <button
              className="btn login"
              onClick={() => {
                setMenuOpen(false);
                handleUserLoginClick();
              }}
            >
              Login
            </button>
          </li>
        </ul>

        <div className="nav-buttons">
          <div className={`nav-search-wrap ${searchOpen ? "open" : ""}`}>
            {searchOpen && (
              <form className="nav-search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search property, location, keyword..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-submit-btn">
                  <FaSearch />
                </button>
              </form>
            )}

            <button
              className="btn nav-icon-btn"
              onClick={() => setSearchOpen((prev) => !prev)}
              type="button"
            >
              {searchOpen ? <FaTimes /> : <FaSearch />}
            </button>
          </div>

          <Link to="/post-property">
            <button className="btn post-property">Post Property</button>
          </Link>

          <button className="btn login" onClick={handleUserLoginClick}>
            Login
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;