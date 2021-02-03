// Imports
const express = require('express');
const path = require('path');
const multer = require('multer');
const favicon = require('serve-favicon');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// App
const app = express();

// Multer
const upload = multer();

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect(
  process.env.DB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log('API connected to DB')
);

// Load utilities
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// For non-file multipart forms
app.use(upload.none());

// Import Routes
const lawRoutes = require('./routes/law');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');
app.use('/api', lawRoutes);
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);

app.listen(process.env.API_PORT, () => {
  console.log('Running API on port:', process.env.API_PORT);
});
