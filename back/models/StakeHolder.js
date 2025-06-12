// models/StakeHolder.js
const { Model } = require('sequelize');
const AbstractGeolocation = require('./AbstractGeolocation');

module.exports = (sequelize, DataTypes) => {
  class StakeHolder extends AbstractGeolocation {}

  StakeHolder.init({
    id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:         { type: DataTypes.STRING,  allowNull: false },
    tax_number:   { type: DataTypes.STRING },
    vat_number:   { type: DataTypes.STRING },
    is_actif:     { type: DataTypes.BOOLEAN, defaultValue: true },
    // mixin des champs géo
    ...AbstractGeolocation.geolocationAttributes()
  }, {
    sequelize,
    modelName: 'StakeHolder',
    tableName: 'StakeHolders',
    timestamps: false
  });

  return StakeHolder;
};
