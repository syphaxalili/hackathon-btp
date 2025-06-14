const express = require("express");
const router = express.Router();
const { UserAccountController } = require("../controllers");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

// Routes utilisateur
router.get("/all", UserAccountController.getAll);
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
// router.get('/:id', authenticateToken, UserAccountController.getById);
// router.put('/:id', authenticateToken, UserAccountController.update);
// router.delete('/:id', authenticateToken, checkRole(['admin']), UserAccountController.delete);

module.exports = router;
