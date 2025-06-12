// app.js
const express = require('express');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

// tes routes
app.use('/api/users', require('./routes/users'));
// … autres routes

module.exports = app;
