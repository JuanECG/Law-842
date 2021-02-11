// Modules
const mongoose = require('mongoose');
const PdfPrinter = require('pdfmake');
const path = require('path');
// DB Models
const Title = require('../models/Title');
const Chapter = require('../models/Chapter');
const Article = require('../models/Article');
const Report = require('../models/Report');
// #region TEMP-CONSTANTS
const FULL = 'TODO';
const TITLE = 'TÍTULO';
const CHAPTER = 'CAPÍTULO';
const ARTICLE = 'ARTÍCULO';
// #endregion
// Fonts
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../fonts/Roboto/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../fonts/Roboto/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../fonts/Roboto/Roboto-MediumItalic.ttf')
  }
};
// Printer
const printer = new PdfPrinter(fonts);

module.exports.makePDF = async (req, res) => {
  const docDef = {
    content: [
      {
        text: 'Reporte de Ley 842 de 2003',
        bold: true,
        fontSize: 22,
        alignment: 'center'
      },
      '\n\n'
    ]
  };
  const IDs = [];
  switch (req.body.type) {
    case FULL:
      const titles = await Title.find().sort({ id: 1 }).lean();
      for (const title of titles) {
        printTitle(docDef, title);
        const chapters = await Chapter.find({ parent: title._id })
          .sort({ id: 1 })
          .lean();
        if (chapters.length)
          for (const chapter of chapters) {
            printChapter(docDef, chapter);
            const articles = await Article.find({ parent: chapter._id })
              .sort({ id: 1 })
              .lean();
            articles.forEach((article) => printArticle(docDef, article));
          }
        else {
          const articles = await Article.find({ parent: title._id })
            .sort({ id: 1 })
            .lean();
          articles.forEach((article) => printArticle(docDef, article));
        }
      }
      break;
    case TITLE:
      for (const element of req.body.elements) {
        IDs.push(element);
        const title = await Title.findById(element).lean();
        printTitle(docDef, title);
        const chapters = await Chapter.find({ parent: element })
          .sort({ id: 1 })
          .lean();
        if (chapters.length)
          for (const chapter of chapters) {
            printChapter(docDef, chapter);
            const articles = await Article.find({ parent: chapter._id })
              .sort({ id: 1 })
              .lean();
            articles.forEach((article) => printArticle(docDef, article));
          }
        else {
          const articles = await Article.find({ parent: title._id })
            .sort({ id: 1 })
            .lean();
          articles.forEach((article) => printArticle(docDef, article));
        }
      }
      break;
    case CHAPTER:
      for (const element of req.body.elements) {
        IDs.push(element);
        const chapter = await Chapter.findById(element).lean();
        printChapter(docDef, chapter);
        const articles = await Article.find({ parent: chapter._id })
          .sort({ id: 1 })
          .lean();
        articles.forEach((article) => printArticle(docDef, article));
      }
      break;
    case ARTICLE:
      for (const element of req.body.elements) {
        IDs.push(element);
        printArticle(docDef, await Article.findById(element).lean());
      }
      break;
    default:
      return res.status(400).send('Bad report request');
  }
  // Save report registry in BD
  new Report({
    _id: new mongoose.Types.ObjectId(),
    category: req.body.type,
    logged: req.header('auth-token') ? true : false,
    data: IDs
  }).save();
  // Create PDF and send to client
  const pdfDoc = printer.createPdfKitDocument(docDef);
  pdfDoc.end();
  res.setHeader('Content-type', 'application/pdf');
  res.setHeader('Content-disposition', 'attachment; filename="report.pdf"');
  res.setHeader('Content-Transfer-Encoding', 'Binary"');
  pdfDoc.pipe(res);
};

function printTitle(docDef, title) {
  docDef.content.push({
    text: `Título ${title.id}: ${title.title}`,
    bold: true,
    fontSize: 16,
    alignment: 'center'
  });
  docDef.content.push('\n');
}

function printChapter(docDef, chapter) {
  docDef.content.push({
    text: `Capítulo ${chapter.id}: ${chapter.title}`,
    bold: true,
    fontSize: 14
  });
  docDef.content.push('\n');
}

function printArticle(docDef, article) {
  docDef.content.push({
    text: `Artículo ${article.id}: ${article.title}`,
    bold: true,
    fontSize: 12
  });
  docDef.content.push({
    text: article.content,
    fontSize: 11
  });
  if (article.note)
    docDef.content.push({
      text: `Nota: ${article.note}`,
      italics: true,
      fontSize: 9
    });
  if (article.paragraphs)
    article.paragraphs.forEach((paragraph, index) => {
      docDef.content.push('\n');
      docDef.content.push({
        text: `Parágrafo ${index + 1}: ${paragraph}`,
        fontSize: 10
      });
    });
  docDef.content.push('\n');
}
