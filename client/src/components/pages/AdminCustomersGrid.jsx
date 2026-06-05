import React, { useEffect, useState } from "react";
import PropertyGridLayout from "./PropertyGridLayout";
import { API_BASE } from "../../utils/api";
import "./AdminCustomersGrid.css";

const AdminCustomersGrid = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCustomerProperties();
  }, []);

  const fetchCustomerProperties = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE}/properties/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("CUSTOMER GRID DATA:", data);

      if (data.properties) {
        setProperties(data.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Fetch customer properties error:", error);
      setProperties([]);
    }
  };

  return (
    <div className="admin-customers-grid-wrapper">
      <div className="admin-customers-grid-header">
        <h2>👥 Customer Properties (Grid)</h2>
        <p>Customer Post Properties</p>
      </div>

      <div className="admin-customers-grid-card">
        <PropertyGridLayout properties={properties} />
      </div>
    </div>
  );
};

export default AdminCustomersGrid;