// models/StakeHolder.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('StakeHolder', {
    id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:         { type: DataTypes.STRING,  allowNull: false },
    tax_number:   { type: DataTypes.STRING },
    vat_number:   { type: DataTypes.STRING },
    is_actif:     { type: DataTypes.BOOLEAN, defaultValue: true },
    address:      { type: DataTypes.STRING },
    postale_code: { type: DataTypes.INTEGER },
    city:         { type: DataTypes.STRING },
    country:      { type: DataTypes.STRING },
    number_phone: { type: DataTypes.STRING },
    email:        { type: DataTypes.STRING }
  });
