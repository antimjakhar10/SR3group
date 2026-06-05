import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar'; 
import Footer from '../Footer';
import { motion, useInView, animate } from 'framer-motion';

// Testimonial Carousel ke liye imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import './AboutUs.css';

const featureData = [
  { id: "01", icon: "🏠", title: "Easy To Rent", desc: "Velox surgo clarus confido carus video lumen virtus spes decerno...", btnText: "Find A Home" },
  { id: "02", icon: "🤝", title: "Carefully Crafted", desc: "Altus cedo tantillus video patrocinor valeo vestrum credo virtus.", btnText: "Sell A Home" },
  { id: "03", icon: "🌱", title: "Eco-Friendly & Green", desc: "Technology is revolutionizing the other legal Technology the legal", btnText: "Rent A Home" },
  { id: "04", icon: "💰", title: "Lavish Greenary", desc: "Confido carus video lumen Velox surgo ok virtus spes decerno.", btnText: "Find A Home" },
  { id: "05", icon: "🧥", title: "In-built Wardrobe", desc: "Velox surgo clarus home of other the cedo virtus spes decerno.", btnText: "Sell A Home" },
  { id: "06", icon: "🏗️", title: "Planned Construction", desc: "Altus cedo tantillus video patrocinor subseco vestrum credo virtus.", btnText: "Rent A Home" },
  { id: "07", icon: "👨‍👩‍👧‍👦", title: "Family & Community", desc: "Technology is revolutionizing the legal tantillus Technology the legal", btnText: "Find A Home" },
  { id: "08", icon: "🔐", title: "Tech & Security", desc: "Confido carus video lumen Velox clarus tantillus virtus spes decerno.", btnText: "Rent A Home" },
];

const Counter = ({ from, to, title, icon, suffix = "+" }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: 2,
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }
  }, [isInView, from, to]);

  return (
    <div className="counter-item" ref={ref}>
      <div className="counter-icon">{icon}</div>
      <div className="counter-text">
        <h3>{count}{suffix}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

const Aboutus = () => {
  // Common Animation Settings
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="about-page-wrapper">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1>About Us</h1>
            <nav className="breadcrumb">
              <Link to="/">Home</Link> <span> &gt; </span> <span className="active-page">About Us</span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* 2. Discover Luxury Property Section */}
      <motion.section
  className="luxury-discovery"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeInUp}
>
  <div className="container discovery-grid">

    {/* LEFT IMAGES */}
    <div className="discovery-images">
      <div className="img-column side-column">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" className="small-img" />
        <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400" className="small-img" />
        <img src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400" className="small-img" />
      </div>

      <div className="img-column main-column">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" className="large-img" />
      </div>

      <div className="img-column side-column">
        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" className="small-img" />
        <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400" className="small-img" />
      </div>
    </div>

    {/* RIGHT CONTENT */}
    <div className="discovery-content">
      <p className="subtitle">— About Us —</p>

      <h2 className="main-title">
        Discover Our Luxury Property, with Full Amenities
      </h2>

      <p className="desc-text">
        Explore premium residential and commercial properties with modern amenities,
        prime locations, and trusted deals. We help you find the perfect property
        that fits your lifestyle and budget.
      </p>

      <div className="features-grid">

        <div className="feature-item">
          <div className="icon-box">📋</div>
          <div className="feature-content">
            <h3>Verified Properties</h3>
            <p>All listings are verified to ensure authenticity and transparency.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="icon-box">💬</div>
          <div className="feature-content">
            <h3>Trusted Guidance</h3>
            <p>Our experts guide you at every step of buying, selling, or renting.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="icon-box">🏠</div>
          <div className="feature-content">
            <h3>Wide Property Range</h3>
            <p>Explore villas, apartments, plots, and commercial spaces easily.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="icon-box">🛡️</div>
          <div className="feature-content">
            <h3>Secure Transactions</h3>
            <p>Safe and hassle-free deals with complete legal support.</p>
          </div>
        </div>

      </div>

      <div className="discovery-footer">
        <Link to="/about" className="more-btn">
          More About Us
        </Link>
      </div>
    </div>

  </div>
</motion.section>

      {/* 3. Signature Features */}
<motion.section className="signature-features" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
  <div className="container">
    <div className="features-header">
      <div><p className="subtitle">— Signature Features —</p><h2 className="main-title">See how Pillar can Help</h2></div>
      <button className="view-all-btn">View All Services</button>
    </div>
    <div className="features-container">
      {featureData.map((item, idx) => (
        <motion.div className="feature-card" key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
          {/* Top Section: Icon and Number */}
          <div className="feature-card-content">
            <div className="card-top">
              <div className="f-icon">{item.icon}</div>
              <span className="f-num">{item.id}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>

          {/* Bottom Section: Button Locked at Bottom */}
          <div className="feature-card-footer">
            <button className="action-btn">
              <Link to="/property">{item.btnText}</Link>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      

      

      


     

      

      <Footer />
    </div>
  );
};

export default Aboutus;