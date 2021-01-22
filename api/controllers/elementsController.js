var Element = require('../models/elements');
const { ObjectId } = require('bson');
const { Mongoose } = require('mongoose');
/* #region TODO
    * Validar que el resultado de a consulta no sea vacia
    * Modificar las consultas en mongo para que funcionen con articulos directamente bajo titulos
    * Puedo hacer que los parágrafos se actualicen, creen y borren con la misma funcion
#endregion */

// #region TEMP-CONSTANTS
const TITLE = 'TÍTULO';
const CHAPTER = 'CAPÍTULO';
const ARTICLE = 'ARTÍCULO';
const PARAGRAPH = 'PARÁGRAFO';
// #endregion

// #region SEARCH

exports.full_law_GET = async function (req, res) {
  try {
    res.json(await Element.find());
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.filter_law_GET = async function (req, res) {
  try {
    //query completa
    const queryResult = await Element.find({
      $or: [
        { title: { $regex: '.*' + req.params.filter + '.*' } },
        { 'child.title': { $regex: '.*' + req.params.filter + '.*' } },
        { 'child.child.title': { $regex: '.*' + req.params.filter + '.*' } },
        {
          'child.child.content': { $regex: '.*' + req.params.filter + '.*' }
        }
      ]
    });
    const result = [];
    queryResult.forEach((title) => {
      if (title.title.includes(req.params.filter)) {
        result.push(title);
      } else {
        title.child.forEach((chapter) => {
          if (chapter.title.includes(req.params.filter)) {
            result.push(chapter);
          } else {
            chapter.child.forEach((article) => {
              if (
                article.title.includes(req.params.filter) ||
                article.content.includes(req.params.filter)
              ) {
                result.push(article);
              }
            });
          }
        });
      }
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.filter_title_GET = async function (req, res) {
  try {
    const result = await Element.find({
      title: { $regex: '.*' + req.params.filter + '.*' }
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.chapter_GET = async function (req, res) {
  try {
    const queryResult = await Element.find({}, { child: 1 });
    const chapters = [];
    queryResult.forEach((title) => {
      title.child.forEach((chapter) => chapters.push(chapter));
    });
    res.json(chapters);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.filter_chapter_GET = async function (req, res) {
  try {
    const queryResult = await Element.find({
      'child.title': { $regex: '.*' + req.params.filter + '.*' }
    });
    var result = [];
    //CHAPTERS DATA PROCESSING
    queryResult.forEach((title) => {
      title.child.forEach((chapter) => {
        if (chapter.title.includes(req.params.filter)) {
          result.push(chapter);
        }
      });
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.article_GET = async function (req, res) {
  try {
    const queryResult = await Element.find({}, { child: 1 });
    const articles = [];
    queryResult.forEach((title) => {
      title.child.forEach((chapter) => {
        chapter.child.forEach((article) => articles.push(article));
      });
    });
    res.json(articles);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.filter_article_GET = async function (req, res) {
  try {
    const queryResult = await Element.find({
      $or: [
        { 'child.child.title': { $regex: '.*' + req.params.filter + '.*' } },
        {
          'child.child.content': { $regex: '.*' + req.params.filter + '.*' }
        }
      ]
    });
    var result = [];
    //ARTICLES DATA PROCESSING
    queryResult.forEach((title) => {
      title.child.forEach((chapter) => {
        chapter.child.forEach((article) => {
          if (
            article.title.includes(req.params.filter) ||
            article.content.includes(req.params.filter)
          ) {
            result.push(article);
          }
        });
      });
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
// #endregion

// #region CREATE
exports.create_element = async function (req, res) {
  switch (req.body.tipo) {
    case TITLE:
      title_POST(req, res);
      break;
    case CHAPTER:
      chapter_POST(req, res);
      break;
    case ARTICLE:
      article_POST(req, res);
      break;
    case PARAGRAPH:
      comment_POST(req, res);
      break;
    default:
      res.status(400).send('Error!!!: Wrong element type');
      break;
  }
};

async function title_POST(req, res) {
  try {
    if (!req.body.nombre) return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    var qTitles = await Element.find({}, { id: 1 }).sort({ id: -1 });
    const lastId = qTitles.length > 0 ? qTitles[0].id + 1 : 1;

    var newTitle = new Element({
      id: lastId,
      type: TITLE,
      title: req.body.nombre
    });

    newTitle.save(function (err) {
      if (err) throw err;
      else res.send('INSERTED new title');
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

async function chapter_POST(req, res) {
  try {
    if (!req.body.nombre || !req.body.padre)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    var qTitle = await Element.findById(req.body.padre);
    const lastId =
      qTitle.child.length > 0
        ? qTitle.child[qTitle.child.length - 1].id + 1
        : 1;

    qTitle.child.push({
      _id: new Mongoose.Types.ObjectId(),
      id: lastId,
      type: CHAPTER,
      title: req.body.nombre
    });

    qTitle.save(function (err) {
      if (err) throw err;
      res.send('INSERTED new Chapter');
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

async function article_POST(req, res) {
  try {
    if (!req.body.nombre || !req.body.padre || !req.body.cuerpo)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Element.findOne({
      'child._id': ObjectId(req.body.padre)
    });
    const qChapter = qTitle.child.id(req.body.padre);
    const lastId =
      qChapter.child.length > 0
        ? qChapter.child[qChapter.child.length - 1].id + 1
        : 1;
    //*** update next articles IDs

    qChapter.child.push({
      _id: new Mongoose.Types.ObjectId(),
      id: lastId,
      type: ARTICLE,
      title: req.body.nombre,
      content: req.body.cuerpo
    });

    qTitle.save(function (err) {
      if (err) throw err;
      res.send('INSERTED new Article');
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

async function comment_POST(req, res) {
  try {
    if (!req.body.padre || !req.body.cuerpo)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Element.findOne({
      'child.child._id': ObjectId(req.body.padre)
    });

    qTitle.child.forEach((qChapter) => {
      const qArticle = qChapter.child.id(req.body.padre);
      if (qArticle) {
        qArticle.paragraphs.push(req.body.cuerpo);

        qTitle.save(function (err) {
          if (err) throw err;
          res.send('INSERTED new Paragraph');
        });

        return;
      }
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}
// #endregion

// #region UPDATE
exports.title_UPDATE = async function (req, res) {
  try {
    if (!req.params.oid || !req.body.nombre)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Element.findById(req.params.oid);

    qTitle.title = req.body.nombre;

    qTitle.save(function (err) {
      if (err) throw err;
      res.send('Title UPDATED');
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.chapter_UPDATE = async function (req, res) {
  try {
    if (!req.params.oid || !req.body.nombre)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Element.findOne({
      'child._id': ObjectId(req.params.oid)
    });
    const qChapter = await qTitle.child.id(req.params.oid);

    qChapter.title = req.body.nombre;

    qTitle.save(function (err) {
      if (err) throw err;
      res.send('Chapter UPDATED');
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.article_UPDATE = async function (req, res) {
  try {
    if (
      !req.params.oid ||
      !req.body.nombre ||
      !req.body.cuerpo ||
      !req.body.nota
    )
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Element.findOne({
      'child.child._id': ObjectId(req.params.oid)
    });

    qTitle.child.forEach((qChapter) => {
      const qArticle = qChapter.child.id(req.params.oid);
      if (qArticle) {
        qArticle.title = req.body.nombre;
        qArticle.content = req.body.cuerpo;
        qArticle.note = req.body.nota;

        qTitle.save(function (err) {
          if (err) throw err;
          res.send('Article UPDATED');
        });

        return;
      }
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.comment_UPDATE = async function (req, res) {
  try {
    if (!req.params.article || !req.body.comentarios)
      return res.status(400).send('Missing Parameters'); // CHECK parameters precense

    const qTitle = await Element.findOne({
      'child.child._id': ObjectId(req.params.article)
    });

    qTitle.child.forEach((qChapter) => {
      const qArticle = qChapter.child.id(req.params.article);
      if (qArticle) {
        if (req.body.comentarios.length > 0)
          qArticle.paragraphs = req.body.comentarios;
        else qArticle.paragraphs = null;

        qTitle.save(function (err) {
          if (err) throw err;
          res.send('Paragraphs UPDATED');
        });

        return;
      }
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
//#endregion

// #region DELETE
exports.element_DELETE = function (req, res) {
  res.send('DELETE any element');
};
// #endregion

// #region MEDIA
exports.media_POST = function (req, res) {
  res.send('INSERT MEDIA');
};

exports.media_UPDATE = function (req, res) {
  res.send('UPDATE MEDIA');
};

exports.media_DELETE = function (req, res) {
  res.send('DELETE MEDIA');
};
// #endregion

/*#region POST EXAMPLES
    
    CREATE TITLE -----------------------------------------------

    {
    "type": "TÍTULO",
    "title": "Título de prueba 2 jaja"
    }


    CREATE CHAPTER -----------------------------------------------
    {
    "type": "CAPÍTULO",
    "parent": "5ffdbbfb5edc91b60a404b73",
    "title": "Caítulo de prueba 1"
    }


    CREATE ARTICLE -----------------------------------------------
    {
    "type": "ARTÍCULO",
    "parent": "5ffdc59eba6403cd1ae2e453",
    "title": "Artículo de prueba 2",
    "content": "Contenido de prueba 2, a ver"
    }

    CREATE PARAGRAPH -----------------------------------------------
    {
    "type": "PARÁGRAFO",
    "parent": "5ffdd09d78c9a0ff9ecb5c93",
    "content": "Parágrafo de prueba 1 jaja"
    }

    UPDATE TITLE -----------------------------------------------
    {
    "oid": "",
    "type": "TÍTULO",
    "title": "Título de prueba"
    }

    UPDATE CHAPTER -----------------------------------------------
    {
    "oid": "5ffdbbfb5edc91b60a404b73",
    "type": "CAPÍTULO",
    "title": "Capítulo 1 actualizado"
    }

    UPDATE ARTICLE -----------------------------------------------
    {
    "oid": "",
    "type": "ARTÍCULO",
    "title": "Artículo de prueba 2",
    "content": "Contenido de prueba 2, a ver",
    "note": "",
    "paragraphs": []
    }

    UPDATE ARTICLE -----------------------------------------------
    {
    "type": "PARÁGRAFO",
    "oid": "5ffdd09d78c9a0ff9ecb5c93",
    "paragraphs": ["Parágrafo de prueba 1 jaja"]
    }

#endregion*/
/*

    const result = await Element.find();
    try{
        res.json(result);
    } catch(err){
        res.json({ message: err})
    }

conts element = new ELement({
    id...
});
try{
    const saveElement = await element.save();
    res.json(saveElement);
} catch(err){
    res.json({ message: err})
}

async ...
const post = await Post.findById(req.params.postId);
same error messagge
*/
