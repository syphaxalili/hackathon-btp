module.exports = (sequelize, DataTypes) =>
  sequelize.define('Skill', {
    id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING,  allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  }, { timestamps: false });
