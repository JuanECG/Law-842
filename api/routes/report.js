// Imports
const router = require('express').Router();
// Controllers
const reportController = require('../controllers/reportController');

// Routes
router.post('/', reportController.makePDF);

module.exports = router;
