const express = require('express');
const { initialize } = require('./config/db');

const app = express();
const port = 5500;

async function main() {
  try {
    console.log('Initialisation de la base de données...');
    await initialize();
    console.log('Base de données initialisée avec succès !');

    app.get('/', (req, res) => {
      res.send('Serveur Node + MySQL opérationnel');
    });

    // Démarrage du serveur
    const server = app.listen(port, () => {
        console.log(`Serveur lancé sur http://localhost:${port}`);
    });

    // Gestion propre de l'arrêt du serveur
    process.on('SIGINT', () => {
      console.log('Arrêt du serveur...');
      server.close(() => {
        console.log('Serveur arrêté');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
    process.exit(1);
  }
}

main();
