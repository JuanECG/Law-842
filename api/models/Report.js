const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  date: { type: Date, default: Date.now },
  data: []
});

module.exports = mongoose.model('Report', ReportSchema, 'reports');