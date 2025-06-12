// routes/users.js
const router = require("express").Router();
const { UserAccount } = require("../models");
import UserAccountController from "../controllers/userAccountController";

// GET all
router.get("/", async (req, res) => {
  const users = await UserAccount.findAll();
  res.json(users);
});

// GET by id
router.get("/:id", async (req, res) => {
  const user = await UserAccount.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Non trouvé" });
  res.json(user);
});

// POST create
router.post("/", async (req, res) => {
  const newUser = await UserAccount.create(req.body);
  res.status(201).json(newUser);
});

//POST Login
router.post("/login", UserAccountController.login);

// PUT update
router.put("/:id", async (req, res) => {
  const user = await UserAccount.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Non trouvé" });
  await user.update(req.body);
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const deleted = await UserAccount.destroy({ where: { id: req.params.id } });
  res.json({ deleted: !!deleted });
});

module.exports = router;
