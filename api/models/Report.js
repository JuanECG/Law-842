const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  date: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['TÍTULO', 'CAPÍTULO', 'ARTÍCULO', 'TODO']
  },
  logged: Boolean,
  data: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('Report', ReportSchema, 'reports');
