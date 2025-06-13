const express = require('express');
const router = express.Router();
const { GeolocationController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes de géolocalisation
router.get('/:id', authenticateToken, GeolocationController.getById);
router.post('/', authenticateToken, checkRole(['admin', 'gestionnaire']), GeolocationController.create);
router.put('/:id', authenticateToken, checkRole(['admin', 'gestionnaire']), GeolocationController.update);
router.delete('/:id', authenticateToken, checkRole(['admin']), GeolocationController.delete);

module.exports = router;
