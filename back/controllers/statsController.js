const { successResponse, errorResponse } = require('./utils');
const { sequelize } = require('../models');

class StatsController {
  static async getDashboardStats(req, res) {
    try {
      const { ConstructionSite, UserAccount, StakeHolder } = req.models;
      const totalSites = await ConstructionSite.count();
      const totalWorkers = await UserAccount.count({ where: { user_type: 'ST' } });
      const totalStakeholders = await StakeHolder.count();
      
      const sitesByStatus = await ConstructionSite.findAll({
        attributes: ['status_construction', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status_construction']
      });
      
      const dashboardStats = {
        totalSites,
        totalWorkers,
        totalStakeholders,
        sitesByStatus: sitesByStatus.reduce((acc, item) => {
          acc[item.status_construction] = item.get('count');
          return acc;
        }, {})
      };
      
      return successResponse(res, dashboardStats);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get worker utilization statistics
  static async getWorkerUtilization(req, res) {
    try {
      const { ConstructionSite, UserAccount } = req.models;
      const totalWorkers = await UserAccount.count({ where: { user_type: 'ST' } });
      const assignedWorkers = await UserAccount.count({
        where: { user_type: 'ST' },
        include: [{
          model: ConstructionSite,
          as: 'sites',
          required: true
        }]
      });
      
      const sites = await ConstructionSite.findAll({
        include: [{
          model: UserAccount,
          as: 'workers',
          attributes: []
        }],
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('workers.id')), 'workerCount']
        ],
        group: ['ConstructionSite.id']
      });
      
      const utilizationStats = {
        totalWorkers,
        assignedWorkers,
        availableWorkers: totalWorkers - assignedWorkers,
        utilizationRate: totalWorkers > 0 ? (assignedWorkers / totalWorkers * 100).toFixed(2) : 0,
        sites: sites.map(site => ({
          siteId: site.id,
          siteName: site.name,
          workerCount: site.get('workerCount')
        }))
      };
      
      return successResponse(res, utilizationStats);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get construction site statistics
  static async getSiteStats(req, res) {
    try {
      const { status } = req.query;
      const { ConstructionSite, StakeHolder, UserAccount } = req.models;
      
      // Options de base pour la requête
      const queryOptions = {
        include: [
          {
            model: StakeHolder,
            as: 'stakeholder',
            attributes: ['id', 'name']
          },
          {
            model: UserAccount,
            as: 'workers',
            attributes: ['id'],
            through: { attributes: [] },
            required: false
          }
        ],
        attributes: [
          'id',
          'name',
          'status_construction',
          'st_Id',
          'n_worker',
          [sequelize.fn('COUNT', sequelize.col('workers.id')), 'assignedWorkers']
        ],
        group: ['ConstructionSite.id', 'stakeholder.id']
      };
      
      // Ajouter le filtre de statut si spécifié
      if (status) {
        queryOptions.where = { status_construction: status };
      }
      
      const sites = await ConstructionSite.findAll(queryOptions);
      
      // Préparer les statistiques
      const stats = {
        total: sites.length,
        byStatus: {},
        byStakeholder: {},
        workerUtilization: {
          totalWorkersNeeded: 0,
          totalWorkersAssigned: 0,
          utilizationRate: 0
        },
        statusDistribution: {
          BR: 0, // Brouillon
          VA: 0, // Validé
          EC: 0, // En cours
          CL: 0, // Clôturé
          AN: 0  // Annulé
        },
        sites: []
      };
      
      // Traiter chaque site
      for (const site of sites) {
        const siteData = site.get({ plain: true });
        const status = siteData.status_construction;
        const stakeholderId = siteData.st_Id;
        const workersNeeded = siteData.n_worker || 0;
        const workersAssigned = parseInt(siteData.assignedWorkers) || 0;
        
        // Mettre à jour les compteurs par statut
        stats.statusDistribution[status] = (stats.statusDistribution[status] || 0) + 1;
        
        // Mettre à jour les compteurs par maître d'ouvrage
        if (stakeholderId) {
          if (!stats.byStakeholder[stakeholderId]) {
            stats.byStakeholder[stakeholderId] = {
              name: siteData.stakeholder?.name || 'Inconnu',
              count: 0,
              workersNeeded: 0,
              workersAssigned: 0
            };
          }
          stats.byStakeholder[stakeholderId].count++;
          stats.byStakeholder[stakeholderId].workersNeeded += workersNeeded;
          stats.byStakeholder[stakeholderId].workersAssigned += workersAssigned;
        }
        
        // Mettre à jour les statistiques d'utilisation des travailleurs
        stats.workerUtilization.totalWorkersNeeded += workersNeeded;
        stats.workerUtilization.totalWorkersAssigned += workersAssigned;
        
        // Ajouter les détails du site
        stats.sites.push({
          id: siteData.id,
          name: siteData.name,
          status,
          stakeholder: siteData.stakeholder?.name || 'Inconnu',
          workers: {
            needed: workersNeeded,
            assigned: workersAssigned,
            utilization: workersNeeded > 0 ? 
              Math.round((workersAssigned / workersNeeded) * 100) : 0
          }
        });
      }
      
      // Calculer le taux d'utilisation global des travailleurs
      if (stats.workerUtilization.totalWorkersNeeded > 0) {
        stats.workerUtilization.utilizationRate = Math.round(
          (stats.workerUtilization.totalWorkersAssigned / stats.workerUtilization.totalWorkersNeeded) * 100
        );
      }
      
      return successResponse(res, stats);
    } catch (error) {
      console.error('Error in getSiteStats:', error);
      return errorResponse(res, error.message);
    }
  }

  // Get worker statistics
  static async getWorkersStats(req, res) {
    try {
      const { UserAccount, ConstructionSite } = req.models;
      const workers = await UserAccount.findByType('worker');
      
      const stats = {
        total: workers.length,
        available: 0,
        assigned: 0,
        bySkill: {},
        byExperience: {
          '0-1': 0,
          '1-3': 0,
          '3-5': 0,
          '5+': 0
        }
      };
      
      // Get worker assignments
      const assignments = await Promise.all(
        workers.map(worker => 
          ConstructionSite.getWorkerCount(worker.id)
        )
      );
      
      workers.forEach((worker, index) => {
        // Count available/assigned
        if (assignments[index] > 0) {
          stats.assigned++;
        } else {
          stats.available++;
        }
        
        // Count by experience
        const experience = worker.experience_years || 0;
        if (experience <= 1) {
          stats.byExperience['0-1']++;
        } else if (experience <= 3) {
          stats.byExperience['1-3']++;
        } else if (experience <= 5) {
          stats.byExperience['3-5']++;
        } else {
          stats.byExperience['5+']++;
        }
        
        // Count by skill
        if (worker.skills && Array.isArray(worker.skills)) {
          worker.skills.forEach(skill => {
            if (!stats.bySkill[skill.id]) {
              stats.bySkill[skill.id] = {
                name: skill.name,
                count: 0
              };
            }
            stats.bySkill[skill.id].count++;
          });
        }
      });
      
      return successResponse(res, stats);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = StatsController;
