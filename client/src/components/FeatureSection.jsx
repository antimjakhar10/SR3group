import React from "react";
import { useNavigate } from "react-router-dom";
import "./FeatureSection.css";

const FeatureSection = () => {
  const navigate = useNavigate();

  const data = [
    {
      id: 1,
      title: "Find your dream home",
      desc: "Explore a wide range of verified properties including apartments, villas, and plots. Find the perfect home that suits your lifestyle and budget.",
      btn: "Find A Home",
      icon: "🏠",
    },
    {
      id: 2,
      title: "Sell your property easily",
      desc: "List your property with us and reach thousands of potential buyers. Get the best value with our trusted and hassle-free selling process.",
      btn: "Sell A Property",
      icon: "🤝",
    },
    {
      id: 3,
      title: "Rent a perfect home",
      desc: "Browse rental properties in prime locations. Choose from affordable to luxury homes with flexible options tailored to your needs.",
      btn: "Rent A Home",
      icon: "🏘️",
    },
  ];

  return (
    <section className="feature-container">
      <div className="overlay"></div>

      <div className="content-wrapper">
        <div className="header-flex">
          <div className="title-side">
            <p className="subtitle">
              <span>—</span> Why Choose Us <span>—</span>
            </p>
            <h2 className="main-heading-trusted">
              Trusted by 100+ Million Buyers
            </h2>
          </div>

          <div className="trust-side">
            <div className="trustpilot">
              <span className="star-icon">★</span> Trustpilot
            </div>
            <div className="avatar-group">
              <img src="https://i.pravatar.cc/100?img=1" alt="user" />
              <img src="https://i.pravatar.cc/100?img=2" alt="user" />
              <img src="https://i.pravatar.cc/100?img=3" alt="user" />
              <div className="more-count">+59K</div>
            </div>
            <div className="rating-info">
              <div className="stars">★★★★★</div>
              <p>19k+ clients</p>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          {data.map((item) => (
            <div className="feature-card" key={item.id}>
              <div className="icon-box">
                <span className="icon-main">{item.icon}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button
                className="card-btn"
                onClick={() => navigate("/property")}
              >
                {item.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;