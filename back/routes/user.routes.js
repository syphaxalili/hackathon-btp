const express = require("express");
const router = express.Router();
const { UserAccountController } = require("../controllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Routes utilisateur
router.get(
  "/all",
  AuthMiddleware.authenticateToken,
  UserAccountController.getAll
);
router.post(
  "/invite",
  AuthMiddleware.authenticateToken,
  UserAccountController.inviteUser
);
router.put(
  "/update",
  AuthMiddleware.authenticateToken,
  UserAccountController.update
);
router.get(
  "/worker/:id",
  AuthMiddleware.authenticateToken,
  UserAccountController.getById
);
// router.put('/:id', authenticateToken, UserAccountController.update);
router.post(
  "/delete/:id",
  AuthMiddleware.authenticateToken,
  UserAccountController.delete
);

module.exports = router;
