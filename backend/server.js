const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "https://sr3group.in",
  "https://www.sr3group.in",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin/auth", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/adminSeed"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/enquiry", require("./routes/enquiry"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err.message));

// Test route
app.get("/", (req, res) => {
  res.send("SR3 Group API is running ✅");
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🔥`);
});