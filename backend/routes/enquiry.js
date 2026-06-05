const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

const auth = require("../middleware/auth");


// GET ALL ENQUIRIES
router.get("/", auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("propertyId", "title")
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE ENQUIRY
router.delete("/:id", auth, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// UPDATE STATUS
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    await Enquiry.findByIdAndUpdate(req.params.id, { status });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    const enquiryData = {
      name,
      email,
      phone,
      message,
    };

    // Only add propertyId if valid ObjectId
    if (propertyId && mongoose.Types.ObjectId.isValid(propertyId)) {
      enquiryData.propertyId = propertyId;
    }

    const newEnquiry = new Enquiry(enquiryData);
    await newEnquiry.save();

    res.status(201).json({ success: true, message: "Enquiry submitted" });
  } catch (error) {
    console.log("FULL ERROR 🔴:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;