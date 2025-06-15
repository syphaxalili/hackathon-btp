const express = require("express");
const db = require("./config/db");
const defineModels = require("./models"); // ton index.js des modèles

const app = express();
const PORT = 5500;

(async () => {
  try {
    await db.initialize();
    const sequelize = db.getSequelize();

    // Ici on initialise les modèles avec l'instance sequelize
    const models = defineModels(sequelize);

    // Synchronisation avec alter:true pour mise à jour des tables
    await sequelize.sync({ alter: true });

    console.log("✅ Base synchronisée.");

    app.use(express.json());

    app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du serveur:", err);
    process.exit(1);
  }
})();
