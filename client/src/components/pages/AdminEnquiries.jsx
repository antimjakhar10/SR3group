import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import "./AdminEnquiries.css";

const AdminEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
    } else {
      fetchEnquiries();
    }
  }, [navigate]);

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_BASE}/enquiry`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Access issue:", res.status);
        setEnquiries([]);
        return;
      }

      const data = await res.json();
      console.log("Enquiries:", data);

      if (Array.isArray(data)) {
        setEnquiries(data);
      } else {
        setEnquiries([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setEnquiries([]);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE}/enquiry/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setEnquiries((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Delete enquiry error:", error);
    }
  };

  const totalCount = Array.isArray(enquiries) ? enquiries.length : 0;
  const newCount = Array.isArray(enquiries)
    ? enquiries.filter((e) => e.status === "New").length
    : 0;
  const contactedCount = Array.isArray(enquiries)
    ? enquiries.filter((e) => e.status === "Contacted").length
    : 0;
  const closedCount = Array.isArray(enquiries)
    ? enquiries.filter((e) => e.status === "Closed").length
    : 0;

  const filteredEnquiries = Array.isArray(enquiries)
    ? enquiries.filter((e) => {
        const matchesSearch =
          e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || e.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentEnquiries = filteredEnquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  return (
    <div className="admin-enquiries-wrapper">
      <div className="admin-enquiries-container">
        <h2>All Enquiries</h2>

        <div className="stats-cards">
          <div className="stat-card purple">
            <h3>Total</h3>
            <p>{totalCount}</p>
          </div>

          <div className="stat-card green">
            <h3>New</h3>
            <p>{newCount}</p>
          </div>

          <div className="stat-card blue">
            <h3>Contacted</h3>
            <p>{contactedCount}</p>
          </div>

          <div className="stat-card red">
            <h3>Closed</h3>
            <p>{closedCount}</p>
          </div>
        </div>

        <div className="filter-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Property</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {currentEnquiries.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      {item.phone}
                      <a
                        href={`https://wa.me/91${item.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                      >
                        WhatsApp
                      </a>
                    </td>
                    <td>
                      <button
                        className="link-btn"
                        onClick={() => setSelectedMessage(item.message)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      {item.propertyId
                        ? item.propertyId.title
                        : "General Enquiry"}
                    </td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      <select
                        value={item.status}
                        className={`status-select ${item.status.toLowerCase()}`}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const token = localStorage.getItem("adminToken");

                          await fetch(`${API_BASE}/enquiry/${item._id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status: newStatus }),
                          });

                          setEnquiries((prev) =>
                            prev.map((enq) =>
                              enq._id === item._id
                                ? { ...enq, status: newStatus }
                                : enq
                            )
                          );
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => setDeleteId(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active-page" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {deleteId && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Delete this enquiry?</h3>

              <div className="modal-actions">
                <button className="delete-btn" onClick={handleDelete}>
                  Yes
                </button>
                <button onClick={() => setDeleteId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {selectedMessage && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Full Message</h3>
              <p>{selectedMessage}</p>
              <button onClick={() => setSelectedMessage(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;