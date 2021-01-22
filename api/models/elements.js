const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    id: Number,
    type: String,
    title: String,
    content: String,
    paragraphs: {type: Array, default: []},
    note: {type: String, default: ''}
});

const ChapterSchema = mongoose.Schema({
    id: Number,
    type: String,
    title: String,
    child: [ArticleSchema]
});

const ElementSchema = mongoose.Schema({
    id: Number,
    type: String,
    title: String,
    child: [ChapterSchema]
});

module.exports = mongoose.model('Elements', ElementSchema);