import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaUser, FaComments } from "react-icons/fa";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";

import "./Blog.css";

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs`);
      const data = await res.json();

      const approvedBlogs = Array.isArray(data)
        ? data.filter((b) => b.approvalStatus === "Approved")
        : [];

      setBlogs(approvedBlogs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <section className="blog-hero">
        <div className="blog-overlay"></div>

        <motion.div
          className="blog-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Blog Grid</h1>

          <div className="blog-breadcrumb">
            <Link to="/">Home</Link>
            <span className="arrow"> &gt; </span>
            <span className="active">Blog Grid</span>
          </div>
        </motion.div>
      </section>

      <section className="blog-grid-section">
        <motion.div
          className="blog-container"
          variants={containerVariant}
          initial="hidden"
          animate="show"
          key={currentPage}
        >
          {currentBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog-details/${blog._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.div
                className="blog-card"
                variants={fadeUp}
                whileHover={{ y: -8 }}
              >
                <div className="blog-img">
                  <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://dummyimage.com/400x300/ccc/000&text=No+Image";
                    }}
                  />
                  <span className="date-badge">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span>
                      <FaUser /> {blog.author || "Admin"}
                    </span>
                    <span>
                      <FaComments /> {blog.comments || 0}
                    </span>
                  </div>

                  <h3>{blog.title}</h3>

                  <button className="read-btn">Read More</button>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ‹
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ›
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Blog;