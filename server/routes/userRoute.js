const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticationMiddleware');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/users', authenticateToken, userController.getAllUsers);

module.exports = router;