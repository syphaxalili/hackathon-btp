const express = require('express');
const router = express.Router();
const { CategoryController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes des catégories
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', authenticateToken, checkRole(['admin']), CategoryController.create);
router.put('/:id', authenticateToken, checkRole(['admin']), CategoryController.update);
router.delete('/:id', authenticateToken, checkRole(['admin']), CategoryController.delete);

module.exports = router;
