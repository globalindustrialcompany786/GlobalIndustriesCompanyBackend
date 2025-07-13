const fs = require("fs");
const https = require("https");
const path1 = require('path');
const connect = require("./config/database");
const env = require("dotenv");
const app = require("./app");
// const cloudinary = require("cloudinary");

env.config({
  path: "./.env",
});

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

connect();

// Create an HTTPS server using the SSL options
const server = https.createServer(
  {
    key: fs.readFileSync(path1.join(__dirname, 'ssl', 'api.globalindustriescompany.private.key')),
    cert: fs.readFileSync(path1.join(__dirname, 'ssl', 'api.globalindustriescompany.certificate.crt')),
    ca: fs.readFileSync(path1.join(__dirname, 'ssl', 'api.globalindustriescompany.ca_bundle.crt'))
  },
  app
);

// Set up the server to listen on the determined port (use a default if not provided)
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT} ✅`);
});
