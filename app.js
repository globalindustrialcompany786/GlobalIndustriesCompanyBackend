const cors = require("cors");
const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const morganLogger = require("morgan");
const app = express();

const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const reportRoute = require("./routes/exporter");
const educationRoute = require("./routes/education");
const dependantRoute = require("./routes/dependant");
const workExperienceRoute = require("./routes/workExperience");
const { verifyTokenUpload } = require("./middlewares/jwtCheck");

app.use(express.json());
app.use(cors({origin:"*"}));

// Data sanitization against NoSql query injection
app.use(mongoSanitize()); // filter out the dollar signs protect from  query injection attact

// Data sanitization against XSS
app.use(xss()); // protect from molision code coming from html

app.use(morganLogger("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use("/uploads", verifyTokenUpload ,express.static("uploads"));

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/report", reportRoute);
app.use("/api/education", educationRoute);
app.use("/api/dependant", dependantRoute);
app.use("/api/workExperience", workExperienceRoute);

app.get("/", (req, res) => {
  res.send("<p>server is live<p>");
});

app.use(function (err, req, res, next) {
  res.send(err.message)
});

module.exports = app;
