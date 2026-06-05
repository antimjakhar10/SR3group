import React, { useEffect } from 'react';
import './View360.css';
import stairsImg from '../assets/stairs.webp'; 

const View360 = () => {
  useEffect(() => {
    // Check if pannellum is loaded from CDN
    if (window.pannellum) {
      window.pannellum.viewer('panorama-viewer', {
        type: "equirectangular",
        panorama: stairsImg,
        autoLoad: true,
        autoRotate: -2,
        showControls: false,
        mouseZoom: false,
        hotSpots: [
          {
            pitch: 11,
            yaw: -167,
            type: "info",
            text: "View Detail Area"
          }
        ]
      });
    }
  }, []);

  return (
    <section className="View360-wrapper">
      <div className="View360-header">
        <h2 className="View360-title">360° Virtual Experience</h2>
      </div>

      <div className="View360-container">
        {/* Is div ke andar 360 viewer render hoga */}
        <div id="panorama-viewer"></div>
        
        {/* Floating Badge */}
        <div className="View360-badge">
          <span>360° View</span>
        </div>
      </div>
    </section>
  );
};

export default View360;