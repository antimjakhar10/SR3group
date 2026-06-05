const http = require("http");

const BASE_URL = process.env.TEST_API_BASE || "http://localhost:4200";

http
  .get(`${BASE_URL}/api/properties/admin/all`, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log(data.substring(0, 500));
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });