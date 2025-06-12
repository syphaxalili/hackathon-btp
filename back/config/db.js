require('dotenv').config();

const mysql = require('mysql2/promise');

// Configuration du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction pour initialiser la base de données
async function initialize() {
  const connection = await pool.getConnection();
  try {
    // Création de la base si non existante
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Base "${process.env.DB_NAME}" créée ou existante.`);
    
    // Sélection de la base de données
    await connection.query(`USE \`${process.env.DB_NAME}\``);
  } finally {
    connection.release();
  }
}

// Fonction pour exécuter une requête
async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  initialize,
  query
};