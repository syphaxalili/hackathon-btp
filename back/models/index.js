// models/index.js

const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) => {
  const Category = require("./Category")(sequelize, DataTypes);
  const SkillsList = require("./SkillsList")(sequelize, DataTypes);
  const UserAccount = require("./UserAccount")(sequelize, DataTypes);
  const StakeHolder = require("./StakeHolder")(sequelize, DataTypes);
  const ConstructionSite = require("./ConstructionSite")(sequelize, DataTypes);
  const Periodicity = require("./Periodicity")(sequelize, DataTypes);

  // Associations
  Category.hasMany(SkillsList, { foreignKey: "CategoryId" });
  SkillsList.belongsTo(Category, { foreignKey: "CategoryId" });

  ConstructionSite.belongsToMany(UserAccount, {
    through: "SiteWorkers",
    as: "workers",
  });
  UserAccount.belongsToMany(ConstructionSite, {
    through: "SiteWorkers",
    as: "sites",
  });

  ConstructionSite.belongsToMany(SkillsList, {
    through: "SiteSkills",
    as: "skills",
  });
  SkillsList.belongsToMany(ConstructionSite, {
    through: "SiteSkills",
    as: "sites",
  });

  StakeHolder.hasMany(ConstructionSite, { foreignKey: "st_Id", as: "sites" });
  ConstructionSite.belongsTo(StakeHolder, {
    foreignKey: "st_Id",
    as: "stakeholder",
  });

  ConstructionSite.hasMany(Periodicity, {
    foreignKey: "ConstructionId",
    as: "periodicities",
  });
  Periodicity.belongsTo(ConstructionSite, {
    foreignKey: "ConstructionId",
    as: "site",
  });

  return {
    sequelize,
    Category,
    SkillsList,
    UserAccount,
    StakeHolder,
    ConstructionSite,
    Periodicity,
  };
};
