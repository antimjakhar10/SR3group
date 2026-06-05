const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied ❌ No Token" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");

    console.log("TOKEN RECEIVED:", token);
console.log("JWT SECRET:", process.env.JWT_SECRET);

const verified = jwt.verify(token, process.env.JWT_SECRET);

console.log("VERIFIED DATA:", verified);

    if (verified.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized ❌" });
    }

    req.admin = verified;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired Token ❌" });
  }
};