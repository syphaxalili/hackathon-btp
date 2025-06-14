const express = require('express');
const router = express.Router();
const { CategoryController } = require('../controllers');
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Routes des catégories
router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', AuthMiddleware.authenticateToken, CategoryController.create);
router.put('/:id', AuthMiddleware.authenticateToken, CategoryController.update);
router.delete('/:id', AuthMiddleware.authenticateToken, CategoryController.delete);

module.exports = router;
