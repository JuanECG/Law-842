const mongoose = require('mongoose');

const TitleSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  id: Number,
  type: String,
  title: String
});

module.exports = mongoose.model('Title', TitleSchema, 'titles');
