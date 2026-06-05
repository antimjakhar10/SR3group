import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyListLayout from "./PropertyListLayout";
import { API_BASE } from "../../utils/api";
import "./AdminCustomersList.css";

const AdminCustomersList = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE}/properties/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("CUSTOMER API DATA:", data);

      if (data.properties) {
        setProperties(data.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Fetch pending customer properties error:", error);
      setProperties([]);
    }
  };

  return (
    <div className="admin-customers-wrapper">
      <div className="admin-customers-container">
        <div className="admin-customers-header">
          <h2>👥 Customer Submitted Properties</h2>
          <p>Customers Post Properties</p>
        </div>

        <PropertyListLayout
          properties={properties}
          showActions={true}
          showApproval={true}
          onEdit={(id) =>
            navigate(`/admin/edit-property/${id}`, {
              state: { from: "customer" },
            })
          }
          onDelete={async (id) => {
            try {
              const token = localStorage.getItem("adminToken");

              await fetch(`${API_BASE}/properties/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              fetchPending();
            } catch (error) {
              console.error("Delete customer property error:", error);
            }
          }}
          onTogglePremium={async (id) => {
            try {
              const token = localStorage.getItem("adminToken");

              const res = await fetch(
                `${API_BASE}/properties/toggle-premium/${id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data = await res.json();

              setProperties((prev) =>
                prev.map((p) =>
                  p._id === id ? { ...p, premium: data.premium } : p
                )
              );
            } catch (error) {
              console.error("Toggle premium error:", error);
            }
          }}
          onUpdateApproval={async (id, status) => {
            try {
              const token = localStorage.getItem("adminToken");

              await fetch(`${API_BASE}/properties/approve/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
              });

              fetchPending();
            } catch (error) {
              console.error("Update approval error:", error);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AdminCustomersList;