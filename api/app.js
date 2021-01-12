const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');

app.use(bodyParser.json());

// ROUTES
const elementsRoutes = require('./routes/elements');
app.use('/law', elementsRoutes);


// MONGOOSE CONNECTION
mongoose.connect(process.env.DB_TEST, {useUnifiedTopology: true, useNewUrlParser: true}, () => console.log('Connected to DB'));

// Listening on port 3000
console.log("Listening on 3000");
app.listen(3000);
