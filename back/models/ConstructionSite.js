const { Model } = require('sequelize');
const AbstractGeolocation = require('./AbstractGeolocation');

module.exports = (sequelize, DataTypes) => {
  class ConstructionSite extends AbstractGeolocation {}

  ConstructionSite.init({
    id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status_construction: { type: DataTypes.ENUM('BR','VA','EC','CL','AN'), allowNull: false },
    n_worker:            { type: DataTypes.INTEGER },
    // mixin des champs géo
    ...AbstractGeolocation.geolocationAttributes()
  }, {
    sequelize,
    modelName: 'ConstructionSite',
    tableName: 'ConstructionSites',
    timestamps: false
  });

  return ConstructionSite;
};
