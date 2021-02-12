const mongoose = require('mongoose');

const ChapterSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  parent: mongoose.Types.ObjectId,
  id: Number,
  type: String,
  title: String,
  media: String,
  url: String
});

module.exports = mongoose.model('Chapter', ChapterSchema, 'chapters');
