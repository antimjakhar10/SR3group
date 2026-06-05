const axios = require("axios");

const BASE_URL = process.env.TEST_API_BASE || "http://localhost:4200";

async function testDeleteProperty() {
  try {
    const getRes = await axios.get(`${BASE_URL}/api/properties`);
    console.log("Found properties:", getRes.data.properties.length);

    if (getRes.data.properties.length > 0) {
      const idToDelete = getRes.data.properties[0]._id;
      console.log("Attempting to delete property:", idToDelete);

      const deleteRes = await axios.delete(
        `${BASE_URL}/api/properties/${idToDelete}`
      );

      console.log("Delete Response:", deleteRes.data);
    }
  } catch (e) {
    if (e.response) {
      console.error("Delete failed:", e.response.status, e.response.data);
    } else {
      console.error("Delete failed:", e.message);
    }
  }
}

testDeleteProperty();