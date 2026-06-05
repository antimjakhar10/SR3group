import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./BlogDetails.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchSingleBlog();
  }, [id]);

  const fetchSingleBlog = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`);
      const data = await res.json();
      setBlog(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!blog) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      <section className="blogdetails-hero">
        <div className="blogdetails-overlay"></div>

        <motion.div
          className="blogdetails-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Blog Details</h1>

          <div className="blogdetails-breadcrumb">
            <Link to="/">Home</Link>
            <span className="arrow"> &gt; </span>
            <span className="active">Blog Details</span>
          </div>
        </motion.div>
      </section>

      <section className="blogdetails-container">
        <motion.div
          className="blogdetails-wrapper"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.img
            variants={fadeUp}
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="blogdetails-main-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://dummyimage.com/600x400/cccccc/000000&text=No+Image";
            }}
          />

          <motion.div variants={fadeUp} className="blogdetails-meta">
            <span>By {blog.author || "Admin"}</span>
            <span>•</span>
            <span>
              {blog.createdAt && new Date(blog.createdAt).toDateString()}
            </span>
            <span>•</span>
            <span>{blog.category || "Real Estate"}</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="blogdetails-title">
            {blog.title}
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="blogdetails-richtext ql-editor"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />

          <motion.blockquote variants={fadeUp}>
            Real estate cannot be lost or stolen, nor can it be carried away.
            Purchased with common sense and managed with care, it is one of the
            safest investments.
          </motion.blockquote>

          <motion.div variants={fadeUp} className="blogdetails-gallery">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
              alt="Gallery 1"
            />
            <img
              src="https://images.unsplash.com/photo-1494526585095-c41746248156"
              alt="Gallery 2"
            />
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
              alt="Gallery 3"
            />
          </motion.div>

          <motion.p variants={fadeUp}>
            Investing in premium real estate not only ensures financial growth
            but also provides long-term security and lifestyle benefits.
            Choosing the right property in the right location makes all the
            difference.
          </motion.p>

          <motion.div variants={fadeUp} className="blogdetails-tags">
            <span>Tags:</span>
            <a href="#">Real Estate</a>
            <a href="#">Investment</a>
            <a href="#">Luxury Living</a>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default BlogDetails;