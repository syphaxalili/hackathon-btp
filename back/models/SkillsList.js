module.exports = (sequelize, DataTypes) =>
  sequelize.define('SkillsList', {
    id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING,  allowNull: false }
  }, { timestamps: false });
