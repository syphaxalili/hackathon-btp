const express = require('express');
const router = express.Router();
const { UserAccountController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes utilisateur
router.get('/', authenticateToken, UserAccountController.getAll);
router.get('/me', authenticateToken, UserAccountController.getMe);
router.get('/:id', authenticateToken, UserAccountController.getById);
router.put('/:id', authenticateToken, UserAccountController.update);
router.delete('/:id', authenticateToken, checkRole(['admin']), UserAccountController.delete);

module.exports = router;
