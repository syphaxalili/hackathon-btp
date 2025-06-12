// config/createDatabase.js
require('dotenv').config();
const mysql = require('mysql2/promise');

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

module.exports = ensureDatabase;
