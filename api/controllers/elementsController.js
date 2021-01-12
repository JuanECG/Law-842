var Element = require('../models/elements');
const { ObjectId } = require("bson");
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

exports.full_law_GET = async function(req, res) {
    try{
        if(req.body.statement) // CHECK statement parameter precense
        {
            //query completa 
            const queryResult = await Element.find( { $or: [{'title': {$regex : ".*"+req.body.statement+".*"} }, {'child.title': {$regex : ".*"+req.body.statement+".*"}}, {'child.child.title': {$regex : ".*"+req.body.statement+".*"}}, {'child.child.content': {$regex : ".*"+req.body.statement+".*"}} ]} );
            var result = [];
            queryResult.forEach(title => {
                if(chapter.title.includes(req.body.statement)){
                    result.push(title);
                }else{
                    title.child.forEach(chapter => {
                        if (chapter.title.includes(req.body.statement)){
                            result.push(chapter);
                        }else{
                            chapter.child.forEach(article => {
                                if (article.title.includes(req.body.statement) || article.content.includes(req.body.statement)){
                                    result.push(article);
                                }
                            });
                        }
                        
                    });
                }
            });
        }else
        {
            const result = await Element.find();
            res.json(result);       
        }
    } catch(err){
        res.json({ message: err})
    }
};

exports.title_GET = async function(req, res) {
    try{
        if(req.body.statement) // CHECK statement parameter precense
        {
            const result = await Element.find({title: {$regex : ".*"+req.body.statement+".*"}});
            res.json(result);   
        }
    } catch(err){
        res.json({ message: err})
    }
};

exports.chapter_GET = async function(req, res) {
    try{
        if(req.body.statement) // CHECK statement parameter precense
        {
            const queryResult = await Element.find({'child.title': {$regex : ".*"+req.body.statement+".*"} });
            var result = [];
            //CHAPTERS DATA PROCESSING
            queryResult.forEach(title => {
                title.child.forEach(chapter => {
                    if (chapter.title.includes(req.body.statement)){
                        result.push(chapter);
                    }
                });
            });
            res.json(result);   
        }
    } catch(err){
        res.json({ message: err})
    }
};

exports.article_GET = async function(req, res) {
    try{
        if(req.body.statement) // CHECK statement parameter precense
        {
            const queryResult = await Element.find({ $or: [{'child.child.title': {$regex : ".*"+req.body.statement+".*"}}, {'child.child.content': {$regex : ".*"+req.body.statement+".*"}}]});
            var result = [];
            //ARTICLES DATA PROCESSING
            queryResult.forEach(title => {
                title.child.forEach(chapter => {
                    chapter.child.forEach(article => {
                        if (article.title.includes(req.body.statement) || article.content.includes(req.body.statement)){
                            result.push(article);
                        }
                    });
                });
            });
            res.json(result);
        }
    } catch(err){
        res.json({ message: err})
    }
};
// #endregion

// #region CREATE

exports.title_POST = async function(req, res) {
    
    if(!req.body.title || !req.body.type)    res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != TITLE)    res.send('Invalid title');
    
    var qTitles = await Element.find({},{id:1}).sort({id: -1});
    const lastId = (qTitles.length > 0) ? qTitles[0].id + 1 : 1;

    var newTitle = new Element({
        id: lastId,
        type: TITLE,
        title: req.body.title,
    });

    newTitle.save(function (err) {
        if (err) return handleError(err);
        res.send('INSERTED new title');
    });
    
};

exports.chapter_POST = async function(req, res) {

    if(!req.body.title || !req.body.type || !req.body.parent) res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != CHAPTER)    res.send('Invalid article');
    
    var qTitle = await Element.findById(req.body.parent);
    const lastId = (qTitle.child.length == 0) ? 1 : qTitle.child[qTitle.child.length-1].id + 1;

    qTitle.child.push({
        id: lastId,
        type: CHAPTER,
        title: req.body.title
    });

    qTitle.save(function (err) {
        if (err) return handleError(err);
        res.send('INSERTED new Chapter');
    });
};

exports.article_POST = async function(req, res) {

    if(!req.body.title || !req.body.type || !req.body.parent || !req.body.content) res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != ARTICLE)    res.send('Invalid article');

    const qTitle = await Element.findOne({'child._id': ObjectId(req.body.parent)});
    const qChapter = qTitle.child.id(req.body.parent);
    const lastId = (qChapter.child.length == 0) ? 1 : qChapter.child[qChapter.child.length-1].id + 1;

    qChapter.child.push({
        id: lastId,
        type: ARTICLE,
        title: req.body.title,
        content: req.body.content
    });

    qTitle.save(function (err) {
        if (err) return handleError(err);
        res.send('INSERTED new Article');
    });
    
};

exports.comment_POST = async function(req, res) {
    if(!req.body.type || !req.body.parent || !req.body.content) res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != PARAGRAPH)    res.send('Invalid paragraph');

    const qTitle = await Element.findOne({'child.child._id': ObjectId(req.body.parent)});
    
    qTitle.child.forEach(qChapter => {
        const qArticle = qChapter.child.id(req.body.parent);
        if (qArticle){
            if (!qArticle.paragraphs) qArticle.paragraphs = [];
            
            qArticle.paragraphs.push(req.body.content);

            qTitle.save(function (err) {
                if (err) return handleError(err);
                res.send('INSERTED new Paragraph');
            });

            return;
        }
    });
};
// #endregion

// #region UPDATE
exports.title_UPDATE = async function(req, res) {
    if(!req.body.oid ||!req.body.title || !req.body.type)    res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != TITLE)    res.send('Invalid title');
    
    var qTitle = await Element.findById(req.body.oid);

    qTitle.title = req.body.title;

    qTitle.save(function (err) {
        if (err) return handleError(err);
        res.send('Title UPDATED');
    });
};

exports.chapter_UPDATE = async function(req, res) {
    if(!req.body.oid ||!req.body.title || !req.body.type)    res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != CHAPTER)    res.send('Invalid chapter');
    
    const qTitle = await Element.findOne({'child._id': ObjectId(req.body.oid)});
    const qChapter = await qTitle.child.id(req.body.oid);

    qChapter.title = req.body.title;

    qTitle.save(function (err) {
        if (err) return handleError(err);
        res.send('Chapter UPDATED');
    });
};

exports.article_UPDATE = async function(req, res) {
    if(!req.body.oid ||!req.body.title || !req.body.type || !req.body.content || !req.body.note || !req.body.paragraphs)    res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != ARTICLE)    res.send('Invalid article');
    
    const qTitle = await Element.findOne({'child.child._id': ObjectId(req.body.oid)});
    
    qTitle.child.forEach(qChapter => {
        const qArticle = qChapter.child.id(req.body.oid);
        if (qArticle){
            
            qArticle.title = req.body.title;
            qArticle.type = ARTICLE;
            qArticle.content = req.body.content;
            if (req.body.paragraphs.length > 0) qArticle.paragraphs = req.body.paragraphs;
            else qArticle.paragraphs = null;
            qArticle.note = req.body.note;

            qTitle.save(function (err) {
                if (err) return handleError(err);
                res.send('Article UPDATED');
            });

            return;
        }
    });
};

exports.comment_UPDATE = async function(req, res) {
    if(!req.body.oid || !req.body.type || !req.body.paragraphs)    res.send('Missing Parameters'); // CHECK parameters precense
    if(req.body.type != PARAGRAPH)    res.send('Invalid Paragraphs');
    
    const qTitle = await Element.findOne({'child.child._id': ObjectId(req.body.oid)});
    
    qTitle.child.forEach(qChapter => {
        const qArticle = qChapter.child.id(req.body.oid);
        if (qArticle){

            if (req.body.paragraphs.length > 0) qArticle.paragraphs = req.body.paragraphs;
            else qArticle.paragraphs = null;

            qTitle.save(function (err) {
                if (err) return handleError(err);
                res.send('Paragraphs UPDATED');
            });

            return;
        }
    });
};
//#endregion

// #region DELETE
exports.element_DELETE = function(req, res) {
    res.send('DELETE any element');
};
// #endregion

// #region MEDIA
exports.media_POST = function(req, res) {
    res.send('INSERT MEDIA');
};

exports.media_UPDATE = function(req, res) {
    res.send('UPDATE MEDIA');
};

exports.media_DELETE = function(req, res) {
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
