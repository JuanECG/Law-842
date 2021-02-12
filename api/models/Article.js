const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  parent: mongoose.Types.ObjectId,
  id: Number,
  type: String,
  title: String,
  content: String,
  paragraphs: [String],
  note: String,
  media: String,
  url: String
});

module.exports = mongoose.model('Article', ArticleSchema, 'articles');
