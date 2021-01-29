// Imports
const router = require('express').Router();
// Controllers
const userController = require('../controllers/userController');

// Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
