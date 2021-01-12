const expresss = require('express');
const router = expresss.Router();

// Require Controllers Module
var elements_controller = require('../controllers/elementsController');

router.get('/full', function(req, res) {
    res.send("full");
});

router.post('/full', elements_controller.full_law_GET);

router.post('/title/search', elements_controller.title_GET);

router.post('/chapter/search', elements_controller.chapter_GET);

router.post('/article/search', elements_controller.article_GET);

router.post('/title/create', elements_controller.title_POST);

router.post('/chapter/create', elements_controller.chapter_POST);

router.post('/article/create', elements_controller.article_POST);

router.post('/comment/create', elements_controller.comment_POST);

router.post('/title/update', elements_controller.title_UPDATE);

router.post('/chapter/update', elements_controller.chapter_UPDATE);

router.post('/article/update', elements_controller.article_UPDATE);

router.post('/comment/update', elements_controller.comment_UPDATE);

router.post('/title/delete', elements_controller.element_DELETE);

router.post('/chapter/delete', elements_controller.element_DELETE);

router.post('/article/delete', elements_controller.element_DELETE);

router.post('/comment/delete', elements_controller.element_DELETE);

module.exports = router;
