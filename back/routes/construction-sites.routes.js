const express = require('express');
const router = express.Router();
const { ConstructionSiteController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes des chantiers
router.get('/', ConstructionSiteController.getAll);
router.get('/:id', ConstructionSiteController.getById);
router.post('/', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.create);
router.put('/:id', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.update);
router.patch('/:id/status', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.updateStatus);
router.delete('/:id', authenticateToken, checkRole(['admin']), ConstructionSiteController.delete);

// Gestion des travailleurs sur un chantier
router.post('/:siteId/workers/:workerId', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.assignWorker);
router.delete('/:siteId/workers/:workerId', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.removeWorker);
router.get('/:id/workers', authenticateToken, ConstructionSiteController.getWorkers);

// Gestion des compétences requises
router.post('/:siteId/skills/:skillId', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.addRequiredSkill);
router.delete('/:siteId/skills/:skillId', authenticateToken, checkRole(['admin', 'gestionnaire']), ConstructionSiteController.removeRequiredSkill);

// Recherche de travailleurs compatibles
router.get('/:siteId/compatible-workers', authenticateToken, ConstructionSiteController.findCompatibleWorkers);

module.exports = router;
