// models/index.js

const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) => {
  // Import des modèles avec leurs définitions Sequelize
  const Category = require("./Category")(sequelize, DataTypes);
  const Skill = require("./Skill")(sequelize, DataTypes);
  const UserAccount = require("./UserAccount")(sequelize, DataTypes);
  const StakeHolder = require("./StakeHolder")(sequelize, DataTypes);
  const ConstructionSite = require("./ConstructionSite")(sequelize, DataTypes);
  const Periodicity = require("./Periodicity")(sequelize, DataTypes);

  // NOTE: AbstractGeolocation n'est pas un modèle Sequelize, donc on ne l'instancie pas ici

  // Associations entre modèles
  Category.hasMany(Skill, { foreignKey: "CategoryId" });
  Skill.belongsTo(Category, { foreignKey: "CategoryId" });

  ConstructionSite.belongsToMany(UserAccount, {
    through: "SiteWorkers",
    as: "workers",
  });
  UserAccount.belongsToMany(ConstructionSite, {
    through: "SiteWorkers",
    as: "sites",
  });

  ConstructionSite.belongsToMany(Skill, {
    through: "SiteSkills",
    as: "skills",
  });
  Skill.belongsToMany(ConstructionSite, {
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

  // Retourne un objet contenant toutes les définitions de modèles
  return {
    sequelize,
    Category,
    Skill,
    UserAccount,
    StakeHolder,
    ConstructionSite,
    Periodicity,
  };
};
