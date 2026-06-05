const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/contactController");
const Contact = require("../models/Contact");

router.post("/", createContact);

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

module.exports = router;