import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    properties: 0,
    enquiries: 0,
    newEnquiries: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      const token = (localStorage.getItem("adminToken") || "").trim();

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [propRes, enqRes] = await Promise.all([
          fetch(`${API_BASE}/properties/admin/all`, { headers }),
          fetch(`${API_BASE}/enquiry`, { headers }),
        ]);

        // sirf actual unauthorized pe hi logout/redirect
        if (
          propRes.status === 401 ||
          propRes.status === 403 ||
          enqRes.status === 401 ||
          enqRes.status === 403
        ) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login", { replace: true });
          return;
        }

        const props = propRes.ok ? await propRes.json() : [];
        const enqs = enqRes.ok ? await enqRes.json() : [];

        const propertiesArray = Array.isArray(props)
          ? props
          : Array.isArray(props?.properties)
          ? props.properties
          : Array.isArray(props?.data)
          ? props.data
          : [];

        const enquiriesArray = Array.isArray(enqs)
          ? enqs
          : Array.isArray(enqs?.enquiries)
          ? enqs.enquiries
          : Array.isArray(enqs?.data)
          ? enqs.data
          : [];

        if (!isMounted) return;

        setStats({
          properties: propertiesArray.length,
          enquiries: enquiriesArray.length,
          newEnquiries: enquiriesArray.filter(
            (e) => String(e?.status || "").toLowerCase() === "new"
          ).length,
        });
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="admin/dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card purple">
          <h3>Total Properties</h3>
          <p>{stats.properties}</p>
        </div>

        <div className="dashboard-card green">
          <h3>Total Enquiries</h3>
          <p>{stats.enquiries}</p>
        </div>

        <div className="dashboard-card red">
          <h3>New Enquiries</h3>
          <p>{stats.newEnquiries}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;