const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content: String,
    image: String,
    author: String,
    category: String,

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null  ,
  required: false  // 👈 ADD THIS
}
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
