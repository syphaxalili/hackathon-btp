const express = require("express");
const router = express.Router();
const { UserAccountController } = require("../controllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Routes d'authentification
router.post("/register", UserAccountController.create);
router.post("/login", UserAccountController.login);
router.get(
  "/me",
  AuthMiddleware.authenticateToken,
  UserAccountController.getMe
);

module.exports = router;
