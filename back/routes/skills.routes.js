const express = require('express');
const router = express.Router();
const { skillController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes des compétences
router.get('/', skillController.getAll);
router.get('/:id', skillController.getById);
router.get('/categories/:categoryId/skills', skillController.getByCategory);
router.post('/', authenticateToken, checkRole(['admin']), skillController.create);
router.put('/:id', authenticateToken, checkRole(['admin']), skillController.update);
router.delete('/:id', authenticateToken, checkRole(['admin']), skillController.delete);

module.exports = router;
