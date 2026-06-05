const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
   propertyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Property",
},
    status: {
      type: String,
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);