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

// Use Render's dynamic port or fallback to 10000 locally
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT} ✅`);
});
