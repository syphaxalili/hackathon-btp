const express = require('express');
const router = express.Router();
const { StakeHoldersController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes des parties prenantes
router.get('/', authenticateToken, StakeHoldersController.getAll);
router.get('/:id', authenticateToken, StakeHoldersController.getById);
router.post('/', authenticateToken, checkRole(['admin']), StakeHoldersController.create);
router.put('/:id', authenticateToken, checkRole(['admin']), StakeHoldersController.update);
router.delete('/:id', authenticateToken, checkRole(['admin']), StakeHoldersController.delete);

module.exports = router;
