const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user");
const imagerRoutes = require("./routes/imager");

const app = express();

// mongoose.set("useCreateIndex", true);
// mongoose
//   .connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(error => {
//     console.log("Connection failed!");
//     console.log("Error: ", error);
//   });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/resource", express.static(path.join("backend/imager-demo/resource")));


app.use("/api/user", userRoutes);
app.use("/api/avatar", imagerRoutes);

module.exports = app;
