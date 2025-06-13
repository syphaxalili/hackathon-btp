const express = require("express");
const db = require("./config/db");
const defineModels = require("./models");
const routes = require("./routes");

const app = express();
const PORT = 5500;

(async () => {
  try {
    await db.initialize();
    const sequelize = db.getSequelize();

    defineModels(sequelize);

    await sequelize.sync({ alter: true });

    console.log("✅ Base synchronisée.");

    app.use(express.json());
    app.use("/api", routes);

    app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du serveur:", err);
    process.exit(1);
  }
})();

 