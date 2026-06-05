const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone,subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
  console.error("CONTACT CONTROLLER ERROR 👉", error);
  res.status(500).json({ message: error.message });
}
};