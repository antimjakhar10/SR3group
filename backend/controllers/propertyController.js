const Property = require("../models/Property");

const BASE_URL =
  process.env.SERVER_BASE_URL ||
  process.env.CLIENT_URL?.replace(/:\d+$/, ":4200") ||
  "http://localhost:4200";

const formatImages = (properties) => {
  return properties.map((p) => ({
    ...p._doc,
    images: (p.images || []).map((img) =>
      img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`
    ),
  }));
};

// 🔥 Helpers
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

const toNumber = (val) => {
  if (val === undefined || val === null || val === "") return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

const toBoolean = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return val.toLowerCase() === "true";
  }
  return false;
};

const parseAmenities = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const parseNearby = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.map((item) => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return { name: item, dist: "" };
      }
    });
  }

  try {
    return [typeof data === "string" ? JSON.parse(data) : data];
  } catch {
    return [{ name: data, dist: "" }];
  }
};

// ================= CREATE =================
exports.createProperty = async (req, res) => {
  try {
    const amenities = parseAmenities(req.body.amenities);
    const nearbyLocations = parseNearby(req.body.nearbyLocations);

    const imagePaths = req.files?.map((f) => f.filename) || [];

    let baseSlug = generateSlug(req.body.title);
    let slug = baseSlug;
    let count = 1;

    while (await Property.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newProperty = new Property({
      ...req.body,
      seoTitle: req.body.seoTitle || req.body.title,
      seoDescription: req.body.seoDescription || req.body.description,
      seoKeywords:
        req.body.seoKeywords ||
        `${req.body.title}, ${req.body.location}, property`,
      slug,
      priceValue: toNumber(req.body.price),
      bedrooms: toNumber(req.body.bedrooms),
      bathrooms: toNumber(req.body.bathrooms),
      sqft: toNumber(req.body.sqft),
      parking: toNumber(req.body.parking),
      amenities,
      nearbyLocations,
      images: imagePaths,
      showInBestProperties: toBoolean(req.body.showInBestProperties),
      showInLuxuryProperties: toBoolean(req.body.showInLuxuryProperties),
      approvalStatus: "Pending",
    });

    await newProperty.save();

    res.status(201).json({ message: "Property Created ✅" });
  } catch (error) {
    console.log("CREATE ERROR 👉", error);
    res.status(500).json({ error: "Create failed ❌" });
  }
};

exports.createPropertyAdmin = async (req, res) => {
  try {
    const amenities = parseAmenities(req.body.amenities);
    const nearbyLocations = parseNearby(req.body.nearbyLocations);

    const imagePaths = req.files?.map((f) => f.filename) || [];

    let baseSlug = generateSlug(req.body.title);
    let slug = baseSlug;
    let count = 1;

    while (await Property.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newProperty = new Property({
      ...req.body,
      seoTitle: req.body.seoTitle || req.body.title,
      seoDescription: req.body.seoDescription || req.body.description,
      seoKeywords:
        req.body.seoKeywords ||
        `${req.body.title}, ${req.body.location}, property`,
      slug,
      priceValue: toNumber(req.body.price),
      bedrooms: toNumber(req.body.bedrooms),
      bathrooms: toNumber(req.body.bathrooms),
      sqft: toNumber(req.body.sqft),
      parking: toNumber(req.body.parking),
      amenities,
      nearbyLocations,
      images: imagePaths,
      showInBestProperties: toBoolean(req.body.showInBestProperties),
      showInLuxuryProperties: toBoolean(req.body.showInLuxuryProperties),
      approvalStatus: "Approved",
      createdBy: null,
      createdByRole: "admin",
    });

    await newProperty.save();

    res.status(201).json({ message: "Admin Property Created ✅" });
  } catch (error) {
    console.log("ADMIN CREATE ERROR 👉", error);
    res.status(500).json({ error: "Create failed ❌" });
  }
};

// ================= UPDATE =================
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const amenities = parseAmenities(req.body.amenities);
    const nearbyLocations = parseNearby(req.body.nearbyLocations);

    const imagePaths = req.files?.map((f) => f.filename) || [];

    const updateData = {
      title: req.body.title || property.title,
      location: req.body.location || property.location,
      seoTitle: req.body.seoTitle || property.seoTitle || property.title,
      seoDescription:
        req.body.seoDescription ||
        property.seoDescription ||
        property.description,
      seoKeywords:
        req.body.seoKeywords ||
        property.seoKeywords ||
        `${property.title}, property`,
      price: req.body.price || property.price,
      priceValue: toNumber(req.body.price),
      type: req.body.type || property.type,
      description:
        req.body.description !== undefined
          ? req.body.description
          : property.description,
      bedrooms: toNumber(req.body.bedrooms),
      bathrooms: toNumber(req.body.bathrooms),
      sqft: toNumber(req.body.sqft),
      parking: toNumber(req.body.parking),
      showInBestProperties: toBoolean(req.body.showInBestProperties),
      showInLuxuryProperties: toBoolean(req.body.showInLuxuryProperties),
      amenities: amenities.length ? amenities : property.amenities,
      nearbyLocations: nearbyLocations.length
        ? nearbyLocations
        : property.nearbyLocations,
      images: imagePaths.length ? imagePaths : property.images,
    };

    await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Property Updated Successfully ✅" });
  } catch (error) {
    console.log("UPDATE ERROR 👉", error);
    res.status(500).json({ error: "Update failed ❌" });
  }
};

// ================= OTHER =================
exports.getAllPropertiesAdmin = async (req, res) => {
  const properties = await Property.find({ createdByRole: "admin" }).sort({
    createdAt: -1,
  });
  res.json({ properties });
};

exports.getCustomerProperties = async (req, res) => {
  const properties = await Property.find({
    createdByRole: "customer",
  }).sort({ createdAt: -1 });
  res.json({ properties });
};

exports.getUserSubmittedProperties = async (req, res) => {
  const properties = await Property.find({
    createdByRole: "user",
  }).sort({ createdAt: -1 });
  res.json({ properties });
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      createdBy: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      createdBy: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      location,
      type,
      range,
      featured,
      best,
      luxury,
      search,
    } = req.query;

    const query = {
      approvalStatus: "Approved",
    };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (type) {
      query.type = { $regex: type, $options: "i" };
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (best === "true") {
      query.showInBestProperties = true;
    }

    if (luxury === "true") {
      query.showInLuxuryProperties = true;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };

      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { type: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { seoTitle: searchRegex },
        { seoDescription: searchRegex },
        { seoKeywords: searchRegex },
      ];
    }

    const properties = await Property.find(query)
      .sort({ premium: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(query);
    const updatedProperties = formatImages(properties);

    res.json({
      properties: updatedProperties,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("GET ERROR 👉", error);
    res.status(500).json({ message: "Error fetching properties" });
  }
};

exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      approvalStatus: "Pending",
    }).sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error) {
    console.log("PENDING ERROR 👉", error);
    res.status(500).json({ message: "Error" });
  }
};

exports.updateApprovalStatus = async (req, res) => {
  await Property.findByIdAndUpdate(req.params.id, {
    approvalStatus: req.body.status,
  });
  res.json({ message: "Status Updated" });
};

exports.togglePremium = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      [
        {
          $set: {
            premium: { $not: "$premium" },
          },
        },
      ],
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: "Premium toggled",
      premium: updated.premium,
    });
  } catch (error) {
    console.log("❌ TOGGLE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};