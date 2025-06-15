const { successResponse, errorResponse } = require('./utils');
const { sequelize } = require('../models');

class StatsController {
 

  static async getKPIs(req, res) {
    try {
      const { UserAccount, ConstructionSite, StakeHolder } = req.models;
 
      // Users KPIs
      const totalUsers = await UserAccount.count();
      const activeUsers = await UserAccount.count({
        where: { is_actif: true },
      });
      const inactiveUsers = await UserAccount.count({
        where: { is_actif: false },
      });
 
      // Construction Sites KPIs
      const totalSites = await ConstructionSite.count();
      const validatedSites = await ConstructionSite.count({
        where: { status_construction: "VA" },
      });
      const closedSites = await ConstructionSite.count({
        where: { status_construction: "CL" },
      });
      const cancelledSites = await ConstructionSite.count({
        where: { status_construction: "AN" },
      });
 
      // StakeHolders KPI
      const totalStakeHolders = await StakeHolder.count();
 
      // Retour JSON explicite
      return res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
        },
        sites: {
          total: totalSites,
          validated: validatedSites,
          closed: closedSites,
          cancelled: cancelledSites,
        },
        stakeholders: {
          total: totalStakeHolders,
        },
      });
    } catch (error) {
      console.error("KPIController.getKPIs error:", error);
      return res
        .status(500)
        .json({ error: "Erreur serveur lors de la récupération des KPIs" });
    }
  }
 
}

module.exports = StatsController;
