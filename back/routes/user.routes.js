const express = require('express');
const router = express.Router();
const { UserAccountController } = require('../controllers');


// Routes utilisateur
router.get('/', UserAccountController.getAll);
// router.get('/auth/me', authenticateToken, UserAccountController.getMe);
// router.get('/:id', authenticateToken, UserAccountController.getById);
// router.put('/:id', authenticateToken, UserAccountController.update);
// router.delete('/:id', authenticateToken, checkRole(['admin']), UserAccountController.delete);

module.exports = router;
