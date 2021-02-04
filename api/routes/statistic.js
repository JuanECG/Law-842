// Imports
const router = require('express').Router();
// Controllers
const statisticController = require('../controllers/statisticController');
const verifyToken = require('../server/verifyToken');

// Routes
router.get('/', verifyToken, statisticController.getStatistics);

module.exports = router;
