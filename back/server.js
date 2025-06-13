require("dotenv").config();
const express = require("express");
const db = require("./config/db"); 
const defineModels = require("./models"); // <- initialise les modèles

const routes = require("./routes");

const app = express();
const PORT = 5500;

(async () => {
  try {
    await db.initialize(); // Crée la BDD et connecte Sequelize
    const sequelize = db.getSequelize(); // récupère instance Sequelize

    const models = defineModels(sequelize); // initialise tes modèles ici
    await sequelize.sync({ alter: true });
    console.log("✅ Base synchronisée.");

    // Middleware JSON
    app.use(express.json());

    // Injecte les modèles dans les routes (via req.models par exemple)
    app.use((req, res, next) => {
      req.models = models;
      next();
    });

      app.use("/", routes);

    app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du serveur:", err);
    process.exit(1);
  }
})();
