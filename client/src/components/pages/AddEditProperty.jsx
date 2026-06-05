import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_BASE, SERVER_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./AddEditProperty.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
  "blockquote",
];

const AddEditProperty = () => {
  const location = useLocation();
  const from = location.state?.from;
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = !!adminToken;

  const { id } = useParams();

  const defaultFacilities = [
    "Pool",
    "Fireplace",
    "Garage",
    "Balcony",
    "Garden",
    "Terrace",
    "View",
    "Elevator",
    "24/7 Security",
    "Parking",
    "Storage",
    "Air Conditioning",
  ];

  const [form, setForm] = useState({
    title: "",
    type: "",
    price: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    description: "",
    location: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    status: "",
    showInBestProperties: false,
    showInLuxuryProperties: false,
    amenities: [],
    nearbyLocations: [],
    images: [],
  });

  const [nearbyOptions, setNearbyOptions] = useState([
    "School",
    "Hospital",
    "Metro Station",
    "Shopping Mall",
    "Park",
  ]);

  const [newNearby, setNewNearby] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState(defaultFacilities);
  const [newFacility, setNewFacility] = useState("");

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    const res = await fetch(`${API_BASE}/properties/${id}`);
    const data = await res.json();

    setForm({
      ...data,
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      seoKeywords: data.seoKeywords || "",
      createdByRole: data.createdByRole,
      showInBestProperties: !!data.showInBestProperties,
      showInLuxuryProperties: !!data.showInLuxuryProperties,
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      nearbyLocations: data.nearbyLocations || [],
      images: data.images || [],
    });

    if (data.images && data.images.length > 0) {
      setImagePreviews(data.images.map((img) => getImageUrl(img)));
    } else if (data.image) {
      setImagePreviews([getImageUrl(data.image)]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleFacility = (item) => {
    if (form.amenities.includes(item)) {
      setForm({
        ...form,
        amenities: form.amenities.filter((f) => f !== item),
      });
    } else {
      setForm({
        ...form,
        amenities: [...form.amenities, item],
      });
    }
  };

  const addFacility = () => {
    if (!newFacility.trim()) return;
    setFacilities([...facilities, newFacility]);
    setNewFacility("");
  };

  const handleNearbyChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setForm({
        ...form,
        nearbyLocations: [...form.nearbyLocations, { name: value, dist: "" }],
      });
    } else {
      setForm({
        ...form,
        nearbyLocations: form.nearbyLocations.filter(
          (item) => item.name !== value
        ),
      });
    }
  };

  const addNearby = () => {
    if (!newNearby.trim()) return;

    if (!nearbyOptions.includes(newNearby)) {
      setNearbyOptions([...nearbyOptions, newNearby]);
    }

    setNewNearby("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      alert("Title and Price required");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    if (!id) {
      if (isAdmin) {
        formData.append("createdByRole", "admin");
      } else {
        formData.append("createdByRole", "user");
        if (user?._id) {
          formData.append("createdBy", user._id);
        }
      }
    }

    Object.keys(form).forEach((key) => {
      if (key === "status") {
        formData.append("approvalStatus", form.status);
      } else if (key === "amenities") {
        form[key].forEach((item) => {
          formData.append("amenities", item);
        });
      } else if (key === "nearbyLocations") {
        form[key].forEach((item) => {
          formData.append("nearbyLocations", JSON.stringify(item));
        });
      } else if (key === "images") {
        if (form.images && form.images.length > 0) {
          form.images.forEach((img) => {
            if (img instanceof File) {
              formData.append("images", img);
            }
          });
        }
      } else {
        formData.append(key, form[key]);
      }
    });

    const url = id
      ? `${API_BASE}/properties/${id}`
      : isAdmin
      ? `${API_BASE}/properties/admin`
      : `${API_BASE}/properties`;

    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (!res.ok) {
      alert("Error saving property ❌");
      setLoading(false);
      return;
    }

    alert(
      id
        ? "Property updated successfully ✅"
        : "Property submitted successfully ✅"
    );

    setLoading(false);

    if (from === "admin") {
      navigate("/admin/properties");
    } else if (from === "customer") {
      navigate("/admin/customers-list");
    } else if (from === "user") {
      navigate("/admin/user-properties");
    } else {
      navigate("/admin/properties");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-property-form">
      <h2 className="form-title">Property Add</h2>

      <div className="form-container">
        <div className="form-grid">
          <div>
            <div className="form-card">
              <h3 className="card-title">Property Details</h3>

              <div className="form-group">
                <label>Property Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col">
                  <label>Property Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land Or Plot">Land Or Plot</option>
                    <option value="Farm">Farm</option>
                  </select>
                </div>

                <div className="col">
                  <label>Price (₹)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label>Area (sq ft)</label>
                  <input
                    name="sqft"
                    value={form.sqft}
                    onChange={handleChange}
                  />
                </div>

                <div className="col">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>For Sale</option>
                    <option>For Rent</option>
                  </select>
                </div>

                <div className="col">
                  <label>Bedrooms</label>
                  <input
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      name="showInBestProperties"
                      checked={form.showInBestProperties}
                      onChange={handleChange}
                    />
                    <span>Show in Best Properties section</span>
                  </label>
                </div>

                <div className="col">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      name="showInLuxuryProperties"
                      checked={form.showInLuxuryProperties}
                      onChange={handleChange}
                    />
                    <span>Show in Luxury Properties section</span>
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label>Bathrooms</label>
                  <input
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                  />
                </div>

                <div className="col">
                  <label>Garage</label>
                  <input
                    name="parking"
                    value={form.parking}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <div className="quill-editor-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        description: value,
                      }))
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter property description"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>SEO Title</label>
                <input
                  name="seoTitle"
                  value={form.seoTitle}
                  onChange={handleChange}
                  placeholder="Enter SEO title"
                />
              </div>

              <div className="form-group">
                <label>SEO Description</label>
                <textarea
                  name="seoDescription"
                  value={form.seoDescription}
                  onChange={handleChange}
                  placeholder="Enter SEO description"
                />
              </div>

              <div className="form-group">
                <label>SEO Keywords</label>
                <input
                  name="seoKeywords"
                  value={form.seoKeywords}
                  onChange={handleChange}
                  placeholder="keyword1, keyword2"
                />
              </div>
            </div>

            <div className="form-card">
              <h3 className="card-title">Location Details</h3>

              <div className="form-group">
                <label>Full Address / Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter full property location"
                />
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="form-card">
              <h3 className="card-title">Upload Image</h3>

              <div
                className="upload-box"
                onClick={() => document.getElementById("imageInput").click()}
              >
                <input
                  id="imageInput"
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;

                    setForm({ ...form, images: files });

                    const previews = files.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setImagePreviews(previews);
                  }}
                />

                {imagePreviews.length > 0 ? (
                  <div className="multi-preview">
                    {imagePreviews.map((img, index) => (
                      <img
                        key={index}
                        src={img.startsWith("blob:") ? img : getImageUrl(img)}
                        alt="preview"
                        className="preview-img"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="upload-text">Click to Upload Property Image</p>
                    <p className="upload-subtext">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>

              <h4 className="section-subtitle">Facilities</h4>

              <div className="checkbox-grid">
                {facilities.map((item, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(item)}
                      onChange={() => toggleFacility(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>

              <div className="add-row">
                <input
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="Enter facility name"
                />
                <button type="button" onClick={addFacility}>
                  + Add
                </button>
              </div>

              <div className="nearby-section">
                <h4 className="section-subtitle">Nearby Locations</h4>

                <div className="checkbox-grid">
                  {nearbyOptions.map((place, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        value={place}
                        checked={form.nearbyLocations.some(
                          (item) => item.name === place
                        )}
                        onChange={handleNearbyChange}
                      />
                      {place}
                    </label>
                  ))}
                </div>

                {form.nearbyLocations.map((item, index) => (
                  <input
                    key={index}
                    placeholder={`Distance for ${item.name}`}
                    value={item.dist}
                    onChange={(e) => {
                      const updated = [...form.nearbyLocations];
                      updated[index].dist = e.target.value;
                      setForm({ ...form, nearbyLocations: updated });
                    }}
                  />
                ))}

                <div className="add-row">
                  <input
                    value={newNearby}
                    onChange={(e) => setNewNearby(e.target.value)}
                    placeholder="Enter nearby place"
                  />
                  <button type="button" onClick={addNearby}>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <div className="form-card submit-card">
              <button type="submit" className="submit-btn full-submit">
                {loading
                  ? "Saving..."
                  : id
                  ? "Update Property"
                  : "Submit Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddEditProperty;