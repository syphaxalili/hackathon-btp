const { Model } = require("sequelize");
const { geolocationAttributes } = require("./AbstractGeolocation"); // importe la fonction utilitaire

module.exports = (sequelize, DataTypes) => {
  class ConstructionSite extends Model {}

  ConstructionSite.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      status_construction: {
        type: DataTypes.ENUM("BR", "VA", "EC", "CL", "AN"),
        allowNull: false,
      },
      n_worker: { type: DataTypes.INTEGER },
      // mixin des champs géo
      ...geolocationAttributes(DataTypes),
    },
    {
      sequelize,
      modelName: "ConstructionSite",
      tableName: "ConstructionSites",
      timestamps: false,
    }
  );

  return ConstructionSite;
};
