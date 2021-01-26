// Modules
const mongoose = require('mongoose');
// DB Models
const Title = require('../models/Title');
const Chapter = require('../models/Chapter');
const Article = require('../models/Article');

module.exports.fullLawGET = async (req, res) => {
  try {
    // Get DB elements
    const articles = await Article.find().lean();
    const chapters = await Chapter.find().lean();
    const titles = await Title.find().lean();
    // Build Hierarchy struct
    articles.forEach((article) => {
      let chapter = chapters.find((chapter) =>
        chapter._id.equals(article.parent)
      );
      // for articles that doesn't have chapter related
      if (!chapter)
        chapter = titles.find((title) => title._id.equals(article.parent));
      if (!chapter.children) chapter.children = [article];
      else chapter.children.push(article);
    });
    chapters.forEach((chapter) => {
      const title = titles.find((title) => title._id.equals(chapter.parent));
      if (!title.children) title.children = [chapter];
      else title.children.push(chapter);
    });
    res.json(titles);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.filterLawGET = async (req, res) => {
  try {
    // Get DB filtered elements
    const articles = await Article.find({
      $or: [
        { title: { $regex: '.*' + req.params.filter + '.*' } },
        { content: { $regex: '.*' + req.params.filter + '.*' } }
      ]
    }).lean();
    const chapters = await Chapter.find({
      title: { $regex: '.*' + req.params.filter + '.*' }
    }).lean();
    const titles = await Title.find({
      title: { $regex: '.*' + req.params.filter + '.*' }
    }).lean();
    //****** working */
  } catch (err) {
    res.status(400).send(err);
  }
};
