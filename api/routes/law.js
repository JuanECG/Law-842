// Imports
const expresss = require('express');
const router = expresss.Router();
// Controllers
const lawController = require('../controllers/lawController');
// Routes
router.get('/elements', lawController.fullLawGET);
router.get('/elements/:filter', lawController.filterLawGET);
router.post('/elements', lawController.createElement);

router.get('/title', lawController.fullLawGET);
router.put('/title/:oid', lawController.titleUPDATE);
router.delete('/title/:oid', lawController.titleDELETE);
router.get('/title/:filter', lawController.filterTitleGET);

router.get('/chapter', lawController.chapterGET);
router.put('/chapter/:oid', lawController.chapterUPDATE);
router.delete('/chapter/:oid', lawController.chapterDELETE);
router.get('/chapter/:filter', lawController.filterChapterGET);

router.get('/article', lawController.articleGET);
router.put('/article/:oid', lawController.articleUPDATE);
router.delete('/article/:oid', lawController.articleDELETE);
router.get('/article/:filter', lawController.filterArticleGET);

router.put('/comment/:article', lawController.commentUPDATE);

module.exports = router;
