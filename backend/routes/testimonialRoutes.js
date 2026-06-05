const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const testimonialController = require("../controllers/testimonialController");

// public
router.get("/", testimonialController.getPublicTestimonials);

// admin
router.get("/admin/all", auth, testimonialController.getAllTestimonials);
router.get("/admin/:id", auth, testimonialController.getSingleTestimonial);
router.post(
  "/admin",
  auth,
  upload.single("image"),
  testimonialController.createTestimonial
);
router.put(
  "/admin/:id",
  auth,
  upload.single("image"),
  testimonialController.updateTestimonial
);
router.delete("/admin/:id", auth, testimonialController.deleteTestimonial);
router.patch("/admin/toggle/:id", auth, testimonialController.toggleTestimonialStatus);

module.exports = router;