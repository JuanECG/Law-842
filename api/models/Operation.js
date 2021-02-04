const mongoose = require('mongoose');

const OperationSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['INSERT', 'UPDATE', 'DELETE', 'SEARCH']
  },
  logged: Boolean,
  category: {
    type: String,
    enum: ['TÍTULO', 'CAPÍTULO', 'ARTÍCULO', 'TODO']
  },
  filter: { type: String, default: '' },
  data: [mongoose.Types.ObjectId]
});

module.exports = mongoose.model('Operation', OperationSchema, 'operations');
