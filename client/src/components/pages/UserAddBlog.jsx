import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./UserAddBlog.css";

const UserAddBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`);
      const data = await res.json();

      setForm({
        title: data.title || "",
        content: data.content || "",
        image: null,
      });

      if (data.image) {
        setPreview(getImageUrl(data.image));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    data.append("userId", user._id);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      const res = await fetch(
        isEdit ? `${API_BASE}/blogs/${id}` : `${API_BASE}/blogs`,
        {
          method: isEdit ? "PUT" : "POST",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Error");

      alert(isEdit ? "Blog updated ✅" : "Blog submitted ✅");
      navigate("/user/my-blogs");
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  return (
    <div className="user-blog-container">
      <div className="user-blog-card">
        <h2>{isEdit ? "Edit Blog" : "Add Blog"}</h2>

        <input
          placeholder="Blog Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Blog Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", marginBottom: "10px" }}
          />
        )}

        <input
          type="file"
          onChange={(e) => {
            setForm({ ...form, image: e.target.files[0] });
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <button onClick={handleSubmit}>
          {isEdit ? "Update Blog" : "Submit Blog"}
        </button>
      </div>
    </div>
  );
};

export default UserAddBlog;