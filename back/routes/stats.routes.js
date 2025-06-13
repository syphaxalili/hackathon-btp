const express = require('express');
const router = express.Router();
const { StatsController } = require('../controllers');
const { authenticateToken, checkRole } = require('./middleware');

// Routes des statistiques
router.get('/dashboard', authenticateToken, checkRole(['admin', 'gestionnaire']), StatsController.getDashboardStats);
router.get('/worker-utilization', authenticateToken, checkRole(['admin', 'gestionnaire']), StatsController.getWorkerUtilization);
router.get('/sites', authenticateToken, checkRole(['admin', 'gestionnaire']), StatsController.getSiteStats);
router.get('/workers', authenticateToken, checkRole(['admin', 'gestionnaire']), StatsController.getWorkersStats);
router.get('/stakeholders', authenticateToken, checkRole(['admin', 'gestionnaire']), StatsController.getStakeholderStats);

module.exports = router;
