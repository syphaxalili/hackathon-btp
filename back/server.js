require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = process.env.PORT || 5500;

// Définir le chemin vers la base de données
const dbPath = path.join(__dirname, `${process.env.DB_NAME}.sqlite`);

// Créer ou ouvrir la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "Erreur lors de l’ouverture de la base de données :",
      err.message
    );
  } else {
    console.log(`Connecté à la base de données SQLite : ${dbPath}`);
    // Créer la table si elle n'existe pas
    db.run(
      `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            )
        `,
      (err) => {
        if (err) {
          console.error(
            "Erreur lors de la création de la table :",
            err.message
          );
        } else {
          console.log('La table "users" est prête.');
        }
      }
    );
  }
});

// Route de test
app.get("/", (req, res) => {
  console.log("Requête GET / reçue");
  res.send("Serveur Node + SQLite opérationnel");
});

// Démarrer le serveur (toujours, même si la DB a une erreur)
app.listen(port, () => {
  console.log(`✅ Serveur Express démarré sur http://localhost:${port}`);
});
