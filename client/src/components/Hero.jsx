import React from "react";
import { motion } from "framer-motion";
import "./Hero.css";
import SearchSection from "./SearchSection";

const Hero = () => {
  return (
    <div className="hero">
      <div className="overlay"></div>

      <motion.div
        className="hero-search-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <SearchSection />
      </motion.div>
    </div>
  );
};

export default Hero;