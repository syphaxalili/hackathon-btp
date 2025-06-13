const express = require('express');
const router = express.Router();
const { UserAccountController } = require('../controllers');

// Routes d'authentification
router.post('/register', UserAccountController.create);
router.post('/login', UserAccountController.login);

module.exports = router;
