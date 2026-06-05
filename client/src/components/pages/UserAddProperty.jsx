import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, SERVER_BASE } from "../../utils/api";
import { getImageUrl } from "../../utils/imageHelper";
import "./UserAddProperty.css";

const UserAddProperty = () => {
  const addFacility = () => {
    if (!newFacility.trim()) return;
    setFacilities([...facilities, newFacility]);
    setNewFacility("");
  };

  const addNearby = () => {
    if (!newNearby.trim()) return;

    if (!nearbyOptions.includes(newNearby)) {
      setNearbyOptions([...nearbyOptions, newNearby]);
    }

    setNewNearby("");
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const user = JSON.parse(localStorage.getItem("user"));

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
    amenities: [],
    nearbyLocations: [],
    images: [],
  });

  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (isEdit) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`);
      const data = await res.json();

      setForm({
        title: data.title || "",
        type: data.type || "",
        price: data.price || "",
        sqft: data.sqft || "",
        bedrooms: data.bedrooms || "",
        bathrooms: data.bathrooms || "",
        parking: data.parking || "",
        description: data.description || "",
        location: data.location || "",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        seoKeywords: data.seoKeywords || "",
        amenities: data.amenities || [],
        nearbyLocations: data.nearbyLocations || [],
        images: data.images || [],
      });

      if (data.images) {
        setPreview(data.images.map((img) => getImageUrl(img)));
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (item) => {
    if (form.amenities.includes(item)) {
      setForm({
        ...form,
        amenities: form.amenities.filter((a) => a !== item),
      });
    } else {
      setForm({
        ...form,
        amenities: [...form.amenities, item],
      });
    }
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("createdByRole", "user");
    formData.append("createdBy", user?._id);

    Object.keys(form).forEach((key) => {
      if (key === "amenities") {
        form[key].forEach((item) => {
          formData.append("amenities", item);
        });
      } else if (key === "nearbyLocations") {
        form[key].forEach((item) => {
          formData.append("nearbyLocations", JSON.stringify(item));
        });
      } else if (key === "images") {
        form[key].forEach((img) => {
          if (img instanceof File) {
            formData.append("images", img);
          }
        });
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      const res = await fetch(
        isEdit ? `${API_BASE}/properties/${id}` : `${API_BASE}/properties`,
        {
          method: isEdit ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed");

      alert(isEdit ? "Updated ✅" : "Submitted ✅");
      navigate("/user/my-properties");
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  const amenitiesList = [
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

  const nearbyList = ["School", "Hospital", "Metro Station", "Mall", "Park"];

  const [facilities, setFacilities] = useState(amenitiesList);
  const [newFacility, setNewFacility] = useState("");
  const [nearbyOptions, setNearbyOptions] = useState(nearbyList);
  const [newNearby, setNewNearby] = useState("");

  return (
    <form className="user-property-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {isEdit ? "Edit Property" : "Add Property"}
      </h2>

      <div className="form-grid">
        <div>
          <div className="form-card">
            <h3 className="card-title">Property Details</h3>

            <div className="form-group">
              <label>Property Title</label>
              <input name="title" value={form.title} onChange={handleChange} />
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
                <input name="sqft" value={form.sqft} onChange={handleChange} />
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
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>SEO Title</label>
              <input
                name="seoTitle"
                value={form.seoTitle}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>SEO Description</label>
              <textarea
                name="seoDescription"
                value={form.seoDescription}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>SEO Keywords</label>
              <input
                name="seoKeywords"
                value={form.seoKeywords}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-card">
            <h3 className="card-title">Location Details</h3>

            <div className="form-group">
              <label>Full Address</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
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
                onChange={handleImage}
              />

              {preview.length > 0 ? (
                <div className="multi-preview">
                  {preview.map((img, i) => (
                    <img
                      key={i}
                      src={
                        img.startsWith("blob:") || img.startsWith("http")
                          ? img
                          : `${SERVER_BASE}/${String(img).replace(/^\/+/, "")}`
                      }
                      className="preview-img"
                      alt="preview"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <p>Click to Upload Property Image</p>
                  <small>PNG, JPG up to 5MB</small>
                </>
              )}
            </div>
          </div>

          <div className="form-card">
            <h3 className="card-title">Facilities</h3>

            <div className="checkbox-grid">
              {facilities.map((item, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
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
          </div>

          <div className="form-card">
            <h3 className="card-title">Nearby Locations</h3>

            <div className="checkbox-grid">
              {nearbyOptions.map((item, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={form.nearbyLocations.some((n) => n.name === item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          nearbyLocations: [
                            ...form.nearbyLocations,
                            { name: item, dist: "" },
                          ],
                        });
                      } else {
                        setForm({
                          ...form,
                          nearbyLocations: form.nearbyLocations.filter(
                            (n) => n.name !== item
                          ),
                        });
                      }
                    }}
                  />
                  {item}
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

          <div className="form-card">
            <button className="submit-btn">
              {isEdit ? "Update Property" : "Submit Property"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserAddProperty;