// Imports
const express = require("express");
const path = require("path");
const multer = require("multer");
const favicon = require("serve-favicon");
const session = require("express-session");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// App
const app = express();

// Multer
const upload = multer();

// Open DB connection

// Load utilities
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
//app.use(session({ secret: 'NMS-session', resave: false, saveUninitialized: false }));

// For non-file multipart forms
app.use(upload.none());

// Import Routes

// Use Routes
app.get("/api", (req, res) => {
  console.log("me llamaron");
  res.send("hola api");
});

app.listen(process.env.API_PORT, () => {
  console.log("Running API on port:", process.env.API_PORT);
});
