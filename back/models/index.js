// models/index.js
const Sequelize    = require('sequelize');
const sequelize    = require('../config/database');
const DataTypes    = Sequelize.DataTypes;

// Import des modèles
const Category        = require('./Category')(sequelize, DataTypes);
const SkillsList      = require('./SkillsList')(sequelize, DataTypes);
const UserAccount     = require('./UserAccount')(sequelize, DataTypes);
const StakeHolder     = require('./StakeHolder')(sequelize, DataTypes);
const ConstructionSite= require('./ConstructionSite')(sequelize, DataTypes);
const Periodicity     = require('./Periodicity')(sequelize, DataTypes);

// 1-N Category → SkillsList
Category.hasMany(SkillsList, { foreignKey: 'CategoryId' });
SkillsList.belongsTo(Category, { foreignKey: 'CategoryId' });

// N-N Site ↔ Users (SiteWorkers)
ConstructionSite.belongsToMany(UserAccount,   { through: 'SiteWorkers', as: 'workers' });
UserAccount.belongsToMany(ConstructionSite,   { through: 'SiteWorkers', as: 'sites' });

// N-N Site ↔ Skills (SiteSkills)
ConstructionSite.belongsToMany(SkillsList,    { through: 'SiteSkills',  as: 'skills' });
SkillsList.belongsToMany(ConstructionSite,    { through: 'SiteSkills',  as: 'sites' });

// 1-N StakeHolder → Site
StakeHolder.hasMany(ConstructionSite, { foreignKey: 'st_Id', as: 'sites' });
ConstructionSite.belongsTo(StakeHolder, { foreignKey: 'st_Id', as: 'stakeholder' });

// 1-N Site → Periodicity
ConstructionSite.hasMany(Periodicity, { foreignKey: 'ConstructionId', as: 'periodicities' });
Periodicity.belongsTo(ConstructionSite, { foreignKey: 'ConstructionId', as: 'site' });

module.exports = {
  sequelize,
  Category,
  SkillsList,
  UserAccount,
  StakeHolder,
  ConstructionSite,
  Periodicity
};
