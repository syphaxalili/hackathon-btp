const express = require("express");
const router = express.Router();
const { ConstructionSiteController } = require("../controllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get(
  "/construction-sites",
  AuthMiddleware.authenticateToken,
  ConstructionSiteController.getAllSites
);

router.get(
  "/construction-sites/:id",
  AuthMiddleware.authenticateToken,
  ConstructionSiteController.getConstructionSiteById
);
router.get(
  "/users/available",
  AuthMiddleware.authenticateToken,
  ConstructionSiteController.getAvailableUsers
);
router.get(
  "/stakeholders/visible",
  AuthMiddleware.authenticateToken,
  ConstructionSiteController.getVisibleStakeholders
);
router.post(
  "/construction-sites",
  AuthMiddleware.authenticateToken,
  ConstructionSiteController.createConstructionSite
);
router.patch(
  "/construction-sites/statut/:id",
  AuthMiddleware.authenticateToken,
  ConstructionSiteController.updateStatus
);

module.exports = router;
