import React, { useEffect, useState } from "react";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./AdminTestimonials.css";

const initialForm = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
  order: 0,
  active: true,
  image: null,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/testimonials/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch testimonials error:", error);
      setTestimonials([]);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPreview("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("quote", form.quote);
      formData.append("rating", form.rating);
      formData.append("order", form.order);
      formData.append("active", form.active);

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId
        ? `${API_BASE}/testimonials/admin/${editingId}`
        : `${API_BASE}/testimonials/admin`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Error saving testimonial");
        return;
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error("Save testimonial error:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      role: item.role || "",
      quote: item.quote || "",
      rating: item.rating || 5,
      order: item.order || 0,
      active: item.active ?? true,
      image: null,
    });
    setPreview(item.image ? getImageUrl(item.image) : "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_BASE}/testimonials/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTestimonials();
    } catch (error) {
      console.error("Delete testimonial error:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_BASE}/testimonials/admin/toggle/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTestimonials();
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  return (
    <div className="admin-testimonials-page">
      <div className="admin-testimonials-header">
        <h2>Testimonials</h2>
        <p>Manage all testimonials from admin panel</p>
      </div>

      <div className="admin-testimonials-grid">
        <form className="testimonial-form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>

          <div className="testimonial-form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="testimonial-form-group">
            <label>Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Home Buyer, Dwarka"
            />
          </div>

          <div className="testimonial-form-group">
            <label>Quote</label>
            <textarea
              name="quote"
              value={form.quote}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="testimonial-row">
            <div className="testimonial-form-group">
              <label>Rating</label>
              <select name="rating" value={form.rating} onChange={handleChange}>
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div className="testimonial-form-group">
              <label>Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testimonial-form-group testimonial-check">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="testimonial-form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {preview && (
            <div className="testimonial-preview">
              <img src={preview} alt="preview" />
            </div>
          )}

          <div className="testimonial-form-actions">
            <button type="submit" className="save-btn">
              {editingId ? "Update Testimonial" : "Add Testimonial"}
            </button>

            {editingId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="testimonial-list-card">
          <h3>All Testimonials</h3>

          <div className="testimonial-admin-list">
            {testimonials.map((item) => (
              <div className="testimonial-admin-item" key={item._id}>
                <div className="testimonial-admin-top">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getImageUrl("uploads/no-image.jpg");
                    }}
                  />

                  <div className="testimonial-admin-info">
                    <h4>{item.name}</h4>
                    <p>{item.role}</p>
                    <span className={`status ${item.active ? "active" : "inactive"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <p className="testimonial-admin-quote">{item.quote}</p>

                <div className="testimonial-admin-actions">
                  <button onClick={() => handleEdit(item)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(item._id)}
                    className="toggle-btn"
                  >
                    {item.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;