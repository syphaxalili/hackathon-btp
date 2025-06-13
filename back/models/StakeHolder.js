// StakeHolder.js
const { Model } = require("sequelize");
const { geolocationAttributes } = require("./AbstractGeolocation"); // importe la fonction utilitaire

module.exports = (sequelize, DataTypes) => {
  class StakeHolder extends Model {}

  StakeHolder.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      tax_number: { type: DataTypes.STRING },
      vat_number: { type: DataTypes.STRING },
      is_actif: { type: DataTypes.BOOLEAN, defaultValue: true },

      // Ajoute les champs géo directement
      ...geolocationAttributes(DataTypes),
    },
    {
      sequelize,
      modelName: "StakeHolder",
      tableName: "StakeHolders",
      timestamps: false,
    }
  );

  return StakeHolder;
};
