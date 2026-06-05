const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getProperties,
  getAllPropertiesAdmin,
  createProperty,
  createPropertyAdmin,
  getCustomerProperties,
  updateApprovalStatus,
  updateProperty,
  deleteProperty,
  getPendingProperties,
  togglePremium,
   getMyProperties,
  getUserProperties,
  getUserSubmittedProperties
} = require("../controllers/propertyController");

// upload folder
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// create
router.post("/", upload.array("images", 10), createProperty);
router.post("/admin", upload.array("images", 10), createPropertyAdmin);

// get
router.get("/", getProperties);
router.get("/admin/all", getAllPropertiesAdmin);
router.get("/customer", getCustomerProperties);
router.get("/pending", getPendingProperties);
router.get("/my/:userId", getMyProperties);
router.get("/user/:userId", getUserProperties);
router.get("/admin/user-properties", getUserSubmittedProperties);

// update
router.put("/approve/:id", updateApprovalStatus);
router.put("/toggle-premium/:id", togglePremium);
router.put("/:id", upload.array("images", 10), updateProperty);

// delete
router.delete("/:id", deleteProperty);

// single property
router.get("/:idOrSlug", async (req, res) => {
  try {
    const Property = require("../models/Property");

    let property;

    if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findById(req.params.idOrSlug);
    } else {
      property = await Property.findOne({ slug: req.params.idOrSlug });
    }

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;