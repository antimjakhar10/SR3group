const http = require("http");
const fs = require("fs");

const BASE_URL = process.env.TEST_API_BASE || "http://localhost:4200";

http
  .get(`${BASE_URL}/api/properties/customer`, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      fs.writeFileSync("api_customer_result.txt", data.substring(0, 1000));
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });