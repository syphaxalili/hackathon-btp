module.exports = (sequelize, DataTypes) =>
  sequelize.define('UserAccount', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_type:  { type: DataTypes.ENUM('AD','OV','CDC','SU','ST'), allowNull: false },
    password:   { type: DataTypes.STRING,  allowNull: false },
    first_name: { type: DataTypes.STRING,  allowNull: false },  
    last_name:  { type: DataTypes.STRING,  allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    is_actif:   { type: DataTypes.BOOLEAN, defaultValue: true }
  });

  