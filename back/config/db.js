require("dotenv").config();
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

let sequelize; // on l'initialise plus tard, après création de la base

// Fonction pour créer la base si elle n'existe pas
async function initialize() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
  });

  try {
    // Crée la base si elle n'existe pas déjà
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`
    );
    console.log(`✅ Base "${process.env.DB_NAME}" créée ou existante.`);
  } catch (error) {
    console.error("❌ Erreur lors de la création de la base :", error);
    throw error;
  } finally {
    await connection.end();
  }

  // Initialise Sequelize uniquement après que la base existe
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log("✅ Connexion Sequelize réussie.");
  } catch (error) {
    console.error("❌ Échec de la connexion Sequelize :", error);
    throw error;
  }
}

// Permet d'importer sequelize ailleurs une fois initialisé
function getSequelize() {
  if (!sequelize) {
    throw new Error("Sequelize n'est pas encore initialisé. Appelle initialize() d'abord.");
  }
  return sequelize;
}

module.exports = { initialize, getSequelize };
