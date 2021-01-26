// Imports
const expresss = require('express');
const router = expresss.Router();
// Controllers
const lawController = require('../controllers/lawController');
// Routes
router.get('/elements', lawController.fullLawGET);

module.exports = router;
