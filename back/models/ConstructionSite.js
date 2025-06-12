// models/ConstructionSite.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('ConstructionSite', {
    id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status_construction: { type: DataTypes.ENUM('BR','VA','EC','CL','AN'), allowNull: false },
    n_worker:           { type: DataTypes.INTEGER },
    address:            { type: DataTypes.STRING },
    postale_code:       { type: DataTypes.INTEGER },
    city:               { type: DataTypes.STRING },
    country:            { type: DataTypes.STRING },
    number_phone:       { type: DataTypes.STRING },
    email:              { type: DataTypes.STRING }
  });
