const { geolocationAttributes } = require("./AbstractGeolocation"); // importe la fonction utilitaire

module.exports = (sequelize, DataTypes) =>
  sequelize.define("UserAccount", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_type: {
      type: DataTypes.ENUM("AD", "OV", "CDC"),
      allowNull: false,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    is_actif: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_visible: { type: DataTypes.BOOLEAN, defaultValue: true },
    ...geolocationAttributes(DataTypes),
  });
