// Imports
const router = require('express').Router();
// Controllers
const lawController = require('../controllers/lawController');
const verifyToken = require('../server/verifyToken');

// Routes
router.get('/elements', lawController.fullLawGET);
router.get('/elements/:filter', lawController.filterLawGET);
router.post('/elements', verifyToken, lawController.createElement);

router.get('/title', lawController.fullLawGET);
router.put('/title/:oid', verifyToken, lawController.titleUPDATE);
router.delete('/title/:oid', verifyToken, lawController.titleDELETE);
router.get('/title/:filter', lawController.filterTitleGET);

router.get('/chapter', lawController.chapterGET);
router.put('/chapter/:oid', verifyToken, lawController.chapterUPDATE);
router.delete('/chapter/:oid', verifyToken, lawController.chapterDELETE);
router.get('/chapter/:filter', lawController.filterChapterGET);

router.get('/article', lawController.articleGET);
router.put('/article/:oid', verifyToken, lawController.articleUPDATE);
router.delete('/article/:oid', verifyToken, lawController.articleDELETE);
router.get('/article/:filter', lawController.filterArticleGET);

router.get('/list/:category', lawController.getList);

module.exports = router;
