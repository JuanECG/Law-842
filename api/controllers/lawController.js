// Modules
const mongoose = require('mongoose');
// DB Models
const Title = require('../models/Title');
const Chapter = require('../models/Chapter');
const Article = require('../models/Article');
const Operation = require('../models/Operation');
// #region TEMP-CONSTANTS
const FULL = 'TODO';
const TITLE = 'TÍTULO';
const CHAPTER = 'CAPÍTULO';
const ARTICLE = 'ARTÍCULO';
// #endregion

// #region SEARCH

module.exports.fullLawGET = async (req, res) => {
  try {
    // Get DB elements
    const articles = await Article.find().sort({ id: 1 }).lean();
    const chapters = await Chapter.find().sort({ id: 1 }).lean();
    const titles = await Title.find().sort({ id: 1 }).lean();
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
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: FULL
    }).save();
    res.json(titles);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterLawGET = async (req, res) => {
  try {
    const IDs = [];
    // Get DB filtered elements
    const articles = await Article.find({
      $or: [
        { title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' } },
        { content: { $regex: '.*' + req.params.filter + '.*', $options: '-i' } }
      ]
    })
      .sort({ id: 1 })
      .lean();
    const chapters = await Chapter.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    })
      .sort({ parent: 1, id: 1 })
      .lean();
    const titles = await Title.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    })
      .sort({ id: 1 })
      .lean();
    const data = [];
    titles.forEach((title) => {
      IDs.push(title._id);
      data.push(title);
    });
    chapters.forEach((chapter) => {
      IDs.push(chapter._id);
      data.push(chapter);
    });
    articles.forEach((article) => {
      IDs.push(article._id);
      data.push(article);
    });
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: FULL,
      filter: req.params.filter,
      data: IDs
    }).save();
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterTitleGET = async (req, res) => {
  try {
    const IDs = [];
    const titles = await Title.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    })
      .sort({ id: 1 })
      .lean();
    for (const title of titles) {
      IDs.push(title._id);
      title.child = await Chapter.find({ parent: title._id })
        .sort({ id: 1 })
        .lean();
      for (const chapter of title.child)
        chapter.child = await Article.find({
          parent: chapter._id
        })
          .sort({ id: 1 })
          .lean();
      title.child.push(
        await Article.find({
          parent: title._id
        })
          .sort({ id: 1 })
          .lean()
      );
    }
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: TITLE,
      filter: req.params.filter,
      data: IDs
    }).save();
    res.json(titles);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.chapterGET = async (req, res) => {
  try {
    // Get DB elements
    const articles = await Article.find().sort({ id: 1 }).lean();
    const chapters = await Chapter.find().sort({ parent: 1, id: 1 }).lean();
    // Build Hierarchy struct
    articles.forEach((article) => {
      const chapter = chapters.find((chapter) =>
        chapter._id.equals(article.parent)
      );
      if (!chapter) return;
      if (!chapter.child) chapter.child = [article];
      else chapter.child.push(article);
    });
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: CHAPTER
    }).save();
    res.json(chapters);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterChapterGET = async (req, res) => {
  try {
    const IDs = [];
    const chapters = await Chapter.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    })
      .sort({ parent: 1, id: 1 })
      .lean();
    for (const chapter of chapters) {
      IDs.push(chapter._id);
      chapter.child = await Article.find({
        parent: chapter._id
      })
        .sort({ id: 1 })
        .lean();
    }
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: CHAPTER,
      filter: req.params.filter,
      data: IDs
    }).save();
    res.json(chapters);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.articleGET = async (req, res) => {
  try {
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: ARTICLE
    }).save();
    res.json(await Article.find().sort({ id: 1 }).lean());
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.filterArticleGET = async (req, res) => {
  try {
    const IDs = [];
    const articles = await Article.find({
      title: { $regex: '.*' + req.params.filter + '.*', $options: '-i' }
    })
      .sort({ id: 1 })
      .lean();
    articles.forEach((article) => IDs.push(article._id));
    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'SEARCH',
      logged: req.header('auth-token') ? true : false,
      category: ARTICLE,
      filter: req.params.filter,
      data: IDs
    }).save();
    res.json(articles);
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

    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'INSERT',
      logged: true,
      category: TITLE
    }).save();

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

    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'INSERT',
      logged: true,
      category: CHAPTER
    }).save();

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
    const lastId = qArticle
      ? qArticle.id + 1
      : await getLastArticleID(req.body.padre);

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

    const updateArticles = await Article.find({
      id: { $gte: lastId },
      _id: { $ne: newArticle._id }
    });

    if (updateArticles) {
      updateArticles.forEach((uArticle) => {
        uArticle.id += 1;
        uArticle.save();
      });
    }

    new Operation({
      _id: new mongoose.Types.ObjectId(),
      type: 'INSERT',
      logged: true,
      category: ARTICLE
    }).save();

    res.send('INSERTED new article');
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getLastArticleID(chapterID) {
  const parentChapter = await Chapter.findById(chapterID);
  let lastArticle = 0;
  let titleParent;

  if (parentChapter) {
    const previousChapters = await Chapter.find({
      parent: mongoose.Types.ObjectId(parentChapter.parent),
      id: { $lt: parentChapter.id }
    });

    lastArticle = await getLastFromChapter(previousChapters);
    if (lastArticle <= 0)
      titleParent = await Title.findById(parentChapter.parent);
  } else titleParent = parentChapter;

  if (lastArticle <= 0) {
    const previousTitles = await Title.find({
      id: { $lt: titleParent.id }
    });

    for (const i in previousTitles.reverse()) {
      const previousChapters = await Chapter.find({
        parent: mongoose.Types.ObjectId(previousTitles[i]._id)
      });

      if (previousChapters)
        lastArticle = await getLastFromChapter(previousChapters);
      else lastArticle = await getLastFromTitle(previousTitles[i]._id);
      if (lastArticle > 0) return lastArticle + 1;
    }
  }

  return lastArticle + 1;
}

async function getLastFromChapter(pChapters) {
  for (const i in pChapters.reverse()) {
    const qArticle = await Article.findOne(
      { parent: mongoose.Types.ObjectId(pChapters[i]._id) },
      { id: 1 }
    ).sort({ id: -1 });
    if (qArticle) return qArticle.id;
  }
  return -1;
}

async function getLastFromTitle(titleID) {
  const qArticle = await Article.findOne(
    { parent: mongoose.Types.ObjectId(titleID._id) },
    { id: 1 }
  ).sort({ id: -1 });
  if (qArticle) return qArticle.id;
  return -1;
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
      new Operation({
        _id: new mongoose.Types.ObjectId(),
        type: 'UPDATE',
        logged: true,
        category: TITLE,
        data: [req.params.oid]
      }).save();
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
      new Operation({
        _id: new mongoose.Types.ObjectId(),
        type: 'UPDATE',
        logged: true,
        category: CHAPTER,
        data: [req.params.oid]
      }).save();
      res.send('Chapter UPDATED');
    } else res.status(500).send('Chapter not found');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.articleUPDATE = async (req, res) => {
  try {
    if (!req.params.oid || !req.body.nombre || !req.body.cuerpo)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qArticle = await Article.findById(req.params.oid);
    if (qArticle) {
      qArticle.title = req.body.nombre;
      qArticle.content = req.body.cuerpo;
      qArticle.note = req.body.nota;
      qArticle.paragraphs = req.body.paragrafos;
      await qArticle.save();
      new Operation({
        _id: new mongoose.Types.ObjectId(),
        type: 'UPDATE',
        logged: true,
        category: ARTICLE,
        data: [req.params.oid]
      }).save();
      res.send('Article UPDATED');
    } else res.status(500).send('Article not found');
  } catch (err) {
    res.status(400).json(err);
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
      if (deleted) {
        let id = deleted.id;
        let title;
        do {
          title = await Title.findOne({ id: id + 1 });
          if (title) {
            title.id -= 1;
            await title.save();
            id += 1;
          }
        } while (title);
        new Operation({
          _id: new mongoose.Types.ObjectId(),
          type: 'DELETE',
          logged: true,
          category: TITLE
        }).save();
        res.send('Title DELETED');
      } else res.status(500).send('No Title found');
    } else res.status(500).send('Error: Title has child');
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
      if (deleted) {
        let id = deleted.id;
        let chapter;
        do {
          chapter = await Chapter.findOne({
            id: id + 1,
            parent: deleted.parent
          });
          if (chapter) {
            chapter.id -= 1;
            await chapter.save();
            id += 1;
          }
        } while (chapter);
        new Operation({
          _id: new mongoose.Types.ObjectId(),
          type: 'DELETE',
          logged: true,
          category: CHAPTER
        }).save();
        res.send('Chapter DELETED');
      } else res.status(500).send('No Chapter found');
    } else res.status(500).send('Error: Chapter has child');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.articleDELETE = async (req, res) => {
  try {
    if (!req.params.oid) return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const deleted = await Article.findByIdAndDelete(req.params.oid);
    if (deleted) {
      let id = deleted.id;
      let article;
      do {
        article = await Article.findOne({ id: id + 1 });
        if (article) {
          article.id -= 1;
          await article.save();
          id += 1;
        }
      } while (article);
      new Operation({
        _id: new mongoose.Types.ObjectId(),
        type: 'DELETE',
        logged: true,
        category: ARTICLE
      }).save();
      res.send('Article DELETED');
    } else res.status(500).send('No Article found');
  } catch (err) {
    res.status(400).json(err);
  }
};

// #endregion

module.exports.getList = async (req, res) => {
  switch (req.params.category) {
    case TITLE:
      res.json(
        await Title.find({}, { _id: 1, title: 1 }).sort({ id: 1 }).lean()
      );
      break;
    case CHAPTER:
      res.json(
        await Chapter.find({}, { _id: 1, title: 1 }).sort({ id: 1 }).lean()
      );
      break;
    case ARTICLE:
      res.json(
        await Article.find({}, { _id: 1, title: 1 }).sort({ id: 1 }).lean()
      );
      break;
    default:
      res.status(400).send('Bad category');
      break;
  }
};
