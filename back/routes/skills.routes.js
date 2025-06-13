const express = require('express');
const router = express.Router();
const { SkillsListController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes des compétences
router.get('/', SkillsListController.getAll);
router.get('/:id', SkillsListController.getById);
router.get('/categories/:categoryId/skills', SkillsListController.getByCategory);
router.post('/', authenticateToken, checkRole(['admin']), SkillsListController.create);
router.put('/:id', authenticateToken, checkRole(['admin']), SkillsListController.update);
router.delete('/:id', authenticateToken, checkRole(['admin']), SkillsListController.delete);

module.exports = router;
