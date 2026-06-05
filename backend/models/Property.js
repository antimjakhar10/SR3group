const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    location: String,
    price: String,
    priceValue: Number,
    type: String,
    category: String,
    description: { type: String, default: "" },   // ✅ ADD THIS

    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    sqft: { type: Number, default: 0 },
    parking: { type: Number, default: 0 },

    elevator: Boolean,
    wifi: Boolean,
    pool: Boolean,

    images: [String],

    featured: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    showInBestProperties: { type: Boolean, default: false },
showInLuxuryProperties: { type: Boolean, default: false },

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdByRole: {
      type: String,
      enum: ["admin", "customer", "user"],
      required: true,
    },

    highlights: {
      type: [
        {
          icon: String,
          label: String,
          value: String,
        },
      ],
      default: [],
    },

    amenities: { type: [String], default: [] },

    nearbyLocations: [
      {
        name: String,
        dist: String,
        icon: String,
      },
    ],

    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);