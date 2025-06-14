const express = require('express');
const router = express.Router();
const { skillController } = require('../controllers');
const AuthMiddleware = require("../middlewares/AuthMiddleware");


// Routes des compétences
router.get('/', skillController.getAll);
router.get('/:id', skillController.getById);
router.get('/categories/:categoryId/skills', skillController.getByCategory);
router.post('/', AuthMiddleware.authenticateToken, skillController.create);
router.put('/:id', AuthMiddleware.authenticateToken, skillController.update);
router.delete('/:id', AuthMiddleware.authenticateToken, skillController.delete);

module.exports = router;
