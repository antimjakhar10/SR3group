const User = require("../models/User");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User Registered Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.json({ message: "Login Success", user });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// GET ALL USERS (ADMIN)
exports.getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};