import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../utils/api";
import "./AdminContacts.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/contact`);
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Error fetching contacts", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="admin-contacts-wrapper">
      <h2>Contact Messages</h2>

      <div className="contacts-table-wrapper">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.subject}</td>
                <td>{item.message}</td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContacts;