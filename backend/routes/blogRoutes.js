const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const upload = require("../middleware/upload");


// ===============================
// 🌐 WEBSITE BLOGS (ONLY APPROVED)
// ===============================
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({
      approvalStatus: "Approved"
    }).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// ✍️ CREATE BLOG
// ===============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, userId, role } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const newBlog = new Blog({
      title,
      content,
      image,

      // 🔥 IMPORTANT
      createdBy: role === "admin" ? null : userId,

      // 🔥 ADMIN = direct approved | USER = pending
      approvalStatus: role === "admin" ? "Approved" : "Pending"
    });

    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog" });
  }
});


// ===============================
// 👩‍💼 ADMIN OWN BLOGS ONLY
// ===============================
router.get("/admin/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({
      createdBy: null   // 🔥 ONLY ADMIN BLOGS
    }).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// 👤 USER BLOGS (FOR APPROVAL)
// ===============================
router.get("/admin/user-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({
      createdBy: { $ne: null }   // 🔥 ONLY USER BLOGS
    }).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// 👤 USER OWN BLOGS
// ===============================
router.get("/user/:userId", async (req, res) => {
  const blogs = await Blog.find({
    createdBy: req.params.userId
  }).sort({ createdAt: -1 });

  res.json(blogs);
});


// ===============================
// ✅ APPROVE / REJECT
// ===============================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const updateData = {
      title,
      content,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating blog" });
  }
});


// ===============================
// 🗑 DELETE BLOG
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});


// ===============================
// ✏️ UPDATE BLOG
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { title, image, content } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, image, content },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: "Error updating blog" });
  }
});

// ===============================
// 📄 SINGLE BLOG
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;