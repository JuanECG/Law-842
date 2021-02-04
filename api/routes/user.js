// Imports
const router = require('express').Router();
// Controllers
const verifyToken = require('../server/verifyToken');
const userController = require('../controllers/userController');

// Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/priv', verifyToken, (req, res) => res.send('priv'));

module.exports = router;
