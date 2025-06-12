require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');

const app = express();
const port = process.env.PORT || 5500;

async function main() {
  // Connexion au serveur MySQL (sans base définie)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  });

  // Création de la base si non existante
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  console.log(`Base "${process.env.DB_NAME}" créée ou existante.`);

  // Maintenant tu peux te reconnecter sur cette base pour faire d’autres requêtes
  await connection.end();

  app.get('/', (req, res) => {
    res.send('Serveur Node + MySQL opérationnel');
  });

  app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
  });
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
