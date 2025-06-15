const express = require("express");
const router = express.Router();
const { StatsController } = require("../controllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Routes des statistiques
router.get(
  "/dashboard",
  AuthMiddleware.authenticateToken,
  StatsController.getKPIs
);

module.exports = router;
