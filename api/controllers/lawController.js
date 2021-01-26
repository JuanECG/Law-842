// Modules
const mongoose = require('mongoose');
// DB Models
const Title = require('../models/Title');
const Chapter = require('../models/Chapter');
const Article = require('../models/Article');
// #region TEMP-CONSTANTS
const TITLE = 'TÍTULO';
const CHAPTER = 'CAPÍTULO';
const ARTICLE = 'ARTÍCULO';
// #endregion

// #region SEARCH

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
      if (!chapter.child) chapter.child = [article];
      else chapter.child.push(article);
    });
    chapters.forEach((chapter) => {
      const title = titles.find((title) => title._id.equals(chapter.parent));
      if (!title.child) title.child = [chapter];
      else title.child.push(chapter);
    });
    res.json(titles);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterLawGET = async (req, res) => {
  try {
    // Get DB filtered elements
    const articles = await Article.find({
      $or: [
        { title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' } },
        { content: { $regex: '.*' + req.params.filter + '.*', $options: '-i' } }
      ]
    }).lean();
    const chapters = await Chapter.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    }).lean();
    const titles = await Title.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    }).lean();
    const data = [];
    titles.forEach((title) => data.push(title));
    chapters.forEach((chapter) => data.push(chapter));
    articles.forEach((article) => data.push(article));
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterTitleGET = async (req, res) => {
  try {
    res.json(
      await Title.find({
        title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
      }).lean()
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.chapterGET = async (req, res) => {
  try {
    // Get DB elements
    const articles = await Article.find().lean();
    const chapters = await Chapter.find().lean();
    // Build Hierarchy struct
    articles.forEach((article) => {
      const chapter = chapters.find((chapter) =>
        chapter._id.equals(article.parent)
      );
      if (!chapter) return;
      if (!chapter.child) chapter.child = [article];
      else chapter.child.push(article);
    });
    res.json(chapters);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterChapterGET = async (req, res) => {
  try {
    res.json(
      await Chapter.find({
        title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
      }).lean()
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.articleGET = async (req, res) => {
  try {
    res.json(await Article.find().lean());
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterArticleGET = async (req, res) => {
  try {
    res.json(
      await Chapter.find({
        title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
      }).lean()
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

// #endregion

// #region CREATE

module.exports.createElement = async (req, res) => {
  switch (req.body.tipo) {
    case TITLE:
      titlePOST(req, res);
      break;
    case CHAPTER:
      chapterPOST(req, res);
      break;
    case ARTICLE:
      articlePOST(req, res);
      break;
    default:
      res.status(400).send('Error!!!: Wrong element type');
      break;
  }
};

async function titlePOST(req, res) {
  try {
    if (!req.body.nombre) return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Title.findOne({}, { id: 1 }).sort({ id: -1 });
    const lastId = qTitle ? qTitle.id + 1 : 1;

    const newTitle = new Title({
      _id: new mongoose.Types.ObjectId(),
      id: lastId,
      type: TITLE,
      title: req.body.nombre
    });

    await newTitle.save();
    res.send('INSERTED new title');
  } catch (err) {
    res.status(400).json(err);
  }
}

async function chapterPOST(req, res) {
  try {
    if (!req.body.nombre || !req.body.padre)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qChapter = await Chapter.findOne(
      { parent: mongoose.Types.ObjectId(req.body.padre) },
      { id: 1 }
    ).sort({ id: -1 });
    const lastId = qChapter ? qChapter.id + 1 : 1;

    const newChapter = new Chapter({
      _id: new mongoose.Types.ObjectId(),
      parent: mongoose.Types.ObjectId(req.body.padre),
      id: lastId,
      type: CHAPTER,
      title: req.body.nombre
    });

    await newChapter.save();
    res.send('INSERTED new chapter');
  } catch (err) {
    res.status(400).json(err);
  }
}

async function articlePOST(req, res) {
  try {
    if (!req.body.nombre || !req.body.padre || !req.body.cuerpo)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qArticle = await Article.findOne(
      { parent: mongoose.Types.ObjectId(req.body.padre) },
      { id: 1 }
    ).sort({ id: -1 });
    const lastId = qArticle ? qArticle.id + 1 : 1;

    const newArticle = new Article({
      _id: new mongoose.Types.ObjectId(),
      parent: mongoose.Types.ObjectId(req.body.padre),
      id: lastId,
      type: ARTICLE,
      title: req.body.nombre,
      content: req.body.cuerpo,
      paragraphs: [],
      note: ''
    });

    await newArticle.save();
    res.send('INSERTED new article');
  } catch (err) {
    res.status(400).json(err);
  }
}

// #endregion

// #region UPDATE

module.exports.titleUPDATE = async (req, res) => {
  try {
    if (!req.params.oid || !req.body.nombre)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Title.findById(req.params.oid);
    if (qTitle) {
      qTitle.title = req.body.nombre;
      await qTitle.save();
      res.send('Title UPDATED');
    } else res.status(500).send('Title not found');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.chapterUPDATE = async (req, res) => {
  try {
    if (!req.params.oid || !req.body.nombre)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qChapter = await Chapter.findById(req.params.oid);
    if (qChapter) {
      qChapter.title = req.body.nombre;
      await qChapter.save();
      res.send('Chapter UPDATED');
    } else res.status(500).send('Chapter not found');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.articleUPDATE = async (req, res) => {
  try {
    if (
      !req.params.oid ||
      !req.body.nombre ||
      !req.body.cuerpo ||
      !req.body.nota
    )
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qArticle = await Article.findById(req.params.oid);
    if (qArticle) {
      qArticle.title = req.body.nombre;
      qArticle.content = req.body.cuerpo;
      qArticle.note = req.body.nota;
      await qArticle.save();
      res.send('Article UPDATED');
    } else res.status(500).send('Article not found');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.commentUPDATE = async (req, res) => {
  try {
    if (!req.body.padre || !req.body.paragraphs)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qArticle = await Article.findById(req.body.padre);
    if (qArticle) {
      qArticle.paragraphs = req.body.paragraphs;
      qArticle.save();
      res.send('INSERTED new Paragraph');
    } else res.status(500).send('Article not found');
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// #endregion

// #region DELETE

module.exports.titleDELETE = async (req, res) => {
  try {
    if (!req.params.oid) return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const chapter = await Chapter.findOne({
      parent: mongoose.Types.ObjectId(req.params.oid)
    }).lean();
    if (!chapter) {
      const deleted = await Title.findByIdAndDelete(req.params.oid);
      if (deleted) res.send('Title DELETED');
      else res.status(500).send('No Title found');
    } else res.status(500).send('Error: Title has children');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.chapterDELETE = async (req, res) => {
  try {
    if (!req.params.oid) return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const article = await Article.findOne({
      parent: mongoose.Types.ObjectId(req.params.oid)
    }).lean();
    if (!article) {
      const deleted = await Chapter.findByIdAndDelete(req.params.oid);
      if (deleted) res.send('Chapter DELETED');
      else res.status(500).send('No Chapter found');
    } else res.status(500).send('Error: Chapter has children');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.articleDELETE = async (req, res) => {
  try {
    if (!req.params.oid) return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const deleted = await Article.findByIdAndDelete(req.params.oid);
    if (deleted) res.send('Article DELETED');
    else res.status(500).send('No Article found');
  } catch (err) {
    res.status(400).json(err);
  }
};

// #endregion
