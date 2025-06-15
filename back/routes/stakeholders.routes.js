const express = require("express");
const router = express.Router();
const { StakeHoldersController } = require("../controllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Routes des parties prenantes
router.get(
  "/all",
  AuthMiddleware.authenticateToken,
  StakeHoldersController.getAll
);
router.get(
  "/:id",
  AuthMiddleware.authenticateToken,
  StakeHoldersController.getById
);
router.post(
  "/create",
  AuthMiddleware.authenticateToken,
  StakeHoldersController.create
);
router.patch(
  "/:id",
  AuthMiddleware.authenticateToken,
  StakeHoldersController.update
);
router.put(
  "/:id",
  AuthMiddleware.authenticateToken,
  StakeHoldersController.delete
);

module.exports = router;
