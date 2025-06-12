require("dotenv").config();
const express = require("express");
const db = require("./config/db"); // <-- ton fichier config/db.js

const app = express();
const PORT = process.env.PORT || 5500;

(async () => {
  try {
    await db.initialize(); // Crée la DB et initialise sequelize
    const sequelize = db.getSequelize(); // récupère l'instance sequelize

    // Synchronise les modèles
    await sequelize.sync({ alter: true });

    console.log("✅ Base synchronisée.");

    app.use(express.json());
    app.use("/api/users", require("./routes/users"));

    app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du serveur:", err);
    process.exit(1);
  }
})();
