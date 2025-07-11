const express = require("express");
const router = express.Router();

// Importer les routes
const authRoutes = require("./auth.routes");
const skillsRoutes = require("./skills.routes");
const categoriesRoutes = require("./categories.routes");
const constructionSitesRoutes = require("./construction-sites.routes");
const stakeholdersRoutes = require("./stakeholders.routes");
const geolocationRoutes = require("./geolocation.routes");
const statsRoutes = require("./stats.routes");
const usersRoutes = require("./user.routes");

// Définir les routes
router.use("/auth", authRoutes);
router.use("/skills", skillsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/sites", constructionSitesRoutes);
router.use("/stakeholders", stakeholdersRoutes);
router.use("/geolocation", geolocationRoutes);
router.use("/stats", statsRoutes);
router.use("/users", usersRoutes);


module.exports = router;
