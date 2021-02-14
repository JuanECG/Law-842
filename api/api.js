// Imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// App
const app = express();

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect(
  process.env.DB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log('API connected to DB')
);

// Load utilities
app.use(bodyParser.json());
app.use('/media', express.static(path.join(__dirname, '../public/media')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// Import Routes
const lawRoutes = require('./routes/law');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');
const statisticRoutes = require('./routes/statistic');
app.use('/api', lawRoutes);
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/statistic', statisticRoutes);

// Serve build front App
app.use('/', express.static(path.join(__dirname, '../build')));

app.listen(process.env.API_PORT, () => {
  console.log('Running API on port:', process.env.API_PORT);
});
