import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./AdminEditBlog.css";

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

const AdminEditBlog = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog({
          title: data.title || "",
          content: data.content || "",
        });

        if (data.image) {
          setPreview(getImageUrl(data.image));
        }
      });
  }, [id]);

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await fetch(`${API_BASE}/blogs/${id}`, {
      method: "PUT",
      body: formData,
    });

    alert("Blog Updated ✅");
  };

  return (
    <div className="admin-edit-blog-container">
      <h2 className="admin-edit-blog-title">Edit Blog</h2>

      <form className="admin-edit-blog-form" onSubmit={handleSubmit}>
        <input
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Enter blog title"
        />

        <div
          className="upload-box"
          onClick={() => document.getElementById("blogImage").click()}
        >
          <input id="blogImage" type="file" hidden onChange={handleImage} />

          {preview ? (
            <div className="preview-wrapper">
              <img src={preview} alt="preview" className="preview-img" />

              <span
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                ❌
              </span>
            </div>
          ) : (
            <>
              <p>Click to Upload Blog Image</p>
              <small>PNG, JPG up to 5MB</small>
            </>
          )}
        </div>

        <div className="quill-editor-wrapper">
          <ReactQuill
            theme="snow"
            value={blog.content}
            onChange={(value) =>
              setBlog((prev) => ({
                ...prev,
                content: value,
              }))
            }
            modules={quillModules}
            formats={quillFormats}
            placeholder="Enter blog content"
          />
        </div>

        <button className="blog-update-btn" type="submit">
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default AdminEditBlog;