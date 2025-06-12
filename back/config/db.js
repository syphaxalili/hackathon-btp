// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

//Connection à la base de données avec Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

///Vérif si la base de données existe déjà et la créer si nécessaire
async function ensureDatabase() {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;
  // Connexion au serveur sans choisir de base
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT || 3306,
    user: DB_USER,
    password: DB_PASS
  });
  // Création si nécessaire
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  console.log(`✅ Base '${DB_NAME}' OK (existante ou créée)`);
  await connection.end();
}


module.exports = sequelize, ensureDatabase;
