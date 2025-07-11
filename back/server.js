require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const defineModels = require("./models"); // <- initialise les modèles
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes");

const app = express();
const PORT = 5500;

// Cors configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON middleware
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

(async () => {
  try {
    await db.initialize({ alter: true }); // Crée la BDD et connecte Sequelize
    const sequelize = db.getSequelize(); // récupère instance Sequelize et met à jour la BDD (ajoute/modifie tables sans perte de données)

    const models = defineModels(sequelize); // initialise tes modèles ici
    await sequelize.sync(); // synchronise les modèles avec la BDD
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
