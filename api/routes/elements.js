// Imports
const expresss = require('express');
const router = expresss.Router();

// Require Controllers Module
const elements_controller = require('../controllers/elementsController');

// Routes
router.get('/elements', elements_controller.full_law_GET);
router.get('/elements/:filter', elements_controller.filter_law_GET);
router.post('/elements', elements_controller.create_element);

router.get('/title', elements_controller.full_law_GET);
router.put('/title/:oid', elements_controller.title_UPDATE);
//router.delete('/title/:oid', elements_controller.title_DELETE);
router.get('/title/:filter', elements_controller.filter_title_GET);

router.get('/chapter', elements_controller.chapter_GET);
router.put('/chapter/:oid', elements_controller.chapter_UPDATE);
//router.delete('/chapter/:oid', elements_controller.chapter_DELETE);
router.get('/chapter/:filter', elements_controller.filter_chapter_GET);

router.get('/article', elements_controller.article_GET);
router.put('/article/:oid', elements_controller.article_UPDATE);
//router.delete('/article/:oid', elements_controller.article_DELETE);
router.get('/article/:filter', elements_controller.filter_article_GET);

router.put('/comment/:article', elements_controller.comment_UPDATE);
//router.delete('/comment/:article', elements_controller.comment_DELETE);

module.exports = router;
