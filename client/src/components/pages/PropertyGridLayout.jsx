import React from "react";
import { getImageUrl } from "../../utils/imageHelper";
import "./PropertyGridLayout.css";

const PropertyGridLayout = ({ properties = [] }) => {
  const resolveImage = (images, image) => {
    let finalImage = null;

    if (images && images.length > 0) {
      finalImage = images[0];
    } else if (image) {
      finalImage = image;
    }

    return getImageUrl(finalImage || "uploads/no-image.jpg");
  };

  return (
    <div className="property-grid">
      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        properties.map((p) => (
          <div key={p._id} className="property-card">
            <div className="property-image-container">
              <img
                src={resolveImage(p.images, p.image)}
                alt={p.title}
                className="property-thumbnail"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getImageUrl("uploads/no-image.jpg");
                }}
              />
            </div>

            <div className="property-details">
              <h4 className="property-title">{p.title}</h4>
              <p className="property-location">{p.location}</p>

              <p className="property-price">
                ₹ {p.price ? Number(p.price).toLocaleString("en-IN") : "0"}
              </p>

              <p className="property-status">
                Status:{" "}
                <span
                  className={`status-text ${p.approvalStatus?.toLowerCase()}`}
                >
                  {p.approvalStatus || "Pending"}
                </span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertyGridLayout;