import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { API_BASE } from "../utils/api";
import { getImageUrl } from "../utils/imageHelper";
import "swiper/css";
import "swiper/css/pagination";
import "./Testimonials.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      const data = await res.json();

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.testimonials)
        ? data.testimonials
        : [];

      setTestimonials(items);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    }
  };

  if (!testimonials.length) return null;

  return (
    <motion.section
      className="testimonials-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="container">
        <div className="testimonial-header text-center">
          <p className="subtitle-red">
            <span>—</span> Testimonials <span>—</span>
          </p>
          <h2 className="main-heading">What Clients Say About SR3 Group</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          loop={testimonials.length > 3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1100: { slidesPerView: 3 },
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((item, index) => {
            const rating = Math.max(1, Math.min(5, Number(item.rating || 5)));

            return (
              <SwiperSlide key={item._id || index}>
                <motion.div
                  className="testimonial-card"
                  whileHover={{ y: -8 }}
                  variants={fadeInUp}
                >
                  <div className="client-img-circle">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getImageUrl("uploads/no-image.jpg");
                      }}
                    />
                  </div>

                  <div className="testimonial-rating">
                    {Array.from({ length: rating }).map((_, idx) => (
                      <Star key={idx} color="#FBBF24" fill="#FBBF24" size={20} />
                    ))}
                  </div>

                  <p className="quote-text">“{item.quote}”</p>
                  <h3 className="client-name">{item.name}</h3>
                  <p className="client-role">{item.role}</p>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </motion.section>
  );
};

export default Testimonials;