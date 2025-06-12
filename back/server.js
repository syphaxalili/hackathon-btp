// index.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5500;

app.locals.sequelize = require('./models').sequelize;
app.locals.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('BD synchronisée');
    app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Erreur de sync:', err);
    process.exit(1);
  });
