import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_BASE } from "../../utils/api";
import "./AdminAddBlog.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
  "blockquote",
];

const AdminAddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("role", "admin");

    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Blog Added Successfully ✅");
        setTitle("");
        setContent("");
        setImage(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to add blog ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="admin-add-blog-container">
      <h2>Add Blog</h2>

      <form className="admin-blog-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <div className="quill-editor-wrapper">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write blog content here..."
          />
        </div>

        <button className="blog-submit-btn" type="submit">
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AdminAddBlog;