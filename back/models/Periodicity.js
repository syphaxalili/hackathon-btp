// models/Periodicity.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('Periodicity', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    start_date: { type: DataTypes.DATE,    allowNull: false },
    end_date:   { type: DataTypes.DATE }
  }, { timestamps: false });
  