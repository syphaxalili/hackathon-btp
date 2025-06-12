// index.js
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();

const PORT = process.env.PORT || 5500;

app.locals.sequelize = require('./models').sequelize;
app.locals.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('BD synchronisée');
    app.use(express.json());
    app.use('/api/users', require('./routes/users'));
    app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Erreur de sync:', err);
    process.exit(1);
  });
  
module.exports = app;
  