const http = require("http");
const fs = require("fs");

const BASE_URL = process.env.TEST_API_BASE || "http://localhost:4200";

http
  .get(`${BASE_URL}/api/properties/admin/all`, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const json = JSON.parse(data);

        if (json.properties) {
          const counts = json.properties.reduce((acc, p) => {
            acc[p.createdBy] = (acc[p.createdBy] || 0) + 1;
            return acc;
          }, {});

          fs.writeFileSync(
            "api_result.txt",
            `Total: ${json.properties.length}, Counts: ${JSON.stringify(counts)}`
          );
        } else {
          fs.writeFileSync(
            "api_result.txt",
            `No properties array in response. Keys: ${Object.keys(json)}`
          );
        }
      } catch (e) {
        fs.writeFileSync(
          "api_result.txt",
          `Error parsing: ${e.message}\n${data.substring(0, 500)}`
        );
      }
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });