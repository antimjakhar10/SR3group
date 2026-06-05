const Testimonial = require("../models/Testimonial");

const normalizeImagePath = (file) => {
  if (!file) return "";
  return file.path.replace(/\\/g, "/");
};

// PUBLIC - only active testimonials
exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true })
      .sort({ order: 1, createdAt: -1 });

    res.json(testimonials);
  } catch (error) {
    console.error("Get public testimonials error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN - all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.json(testimonials);
  } catch (error) {
    console.error("Get all testimonials error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSingleTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (error) {
    console.error("Get single testimonial error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, quote, rating, active, order } = req.body;

    const testimonial = new Testimonial({
      name,
      role,
      quote,
      rating: Number(rating) || 5,
      active: active === "false" ? false : true,
      order: Number(order) || 0,
      image: req.file ? normalizeImagePath(req.file) : "",
    });

    await testimonial.save();

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { name, role, quote, rating, active, order } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonial.name = name ?? testimonial.name;
    testimonial.role = role ?? testimonial.role;
    testimonial.quote = quote ?? testimonial.quote;
    testimonial.rating = rating ? Number(rating) : testimonial.rating;
    testimonial.order = order !== undefined ? Number(order) : testimonial.order;

    if (active !== undefined) {
      testimonial.active = active === "false" ? false : Boolean(active === true || active === "true");
    }

    if (req.file) {
      testimonial.image = normalizeImagePath(req.file);
    }

    await testimonial.save();

    res.json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonial.active = !testimonial.active;
    await testimonial.save();

    res.json({
      message: "Status updated successfully",
      active: testimonial.active,
    });
  } catch (error) {
    console.error("Toggle testimonial status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};