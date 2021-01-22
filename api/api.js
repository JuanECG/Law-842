// Imports
const express = require('express');
const path = require('path');
const multer = require('multer');
const favicon = require('serve-favicon');
const session = require('express-session');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// App
const app = express();

// Multer
const upload = multer();

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect(
  process.env.DB_DEV_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log('API Connected to Test DB')
);

// Load utilities
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
//app.use(session({ secret: 'LAW-session', resave: false, saveUninitialized: false }));

// For non-file multipart forms
app.use(upload.none());

// Import Routes
const elementsRoutes = require('./routes/elements');
app.use('/api', elementsRoutes);

app.listen(process.env.API_PORT, () => {
  console.log('Running API on port:', process.env.API_PORT);
});
