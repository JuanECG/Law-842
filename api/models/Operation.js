const mongoose = require('mongoose');

const OperationSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  date: { type: Date, default: Date.now },
  type: String,
  logged: Boolean,
  filter: String,
  text: { type: String, default: "" }
});

module.exports = mongoose.model('Operation', OperationSchema, 'operations');