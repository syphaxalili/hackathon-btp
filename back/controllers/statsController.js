const BaseController = require('./baseController');
const { StatsModel, ConstructionSiteModel, UserAccountModel } = require('../models');

class StatsController extends BaseController {
  // Get dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      const dashboardStats = await StatsModel.getDashboardStats();
      return this.successResponse(res, dashboardStats);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get worker utilization statistics
  static async getWorkerUtilization(req, res) {
    try {
      const utilizationStats = await StatsModel.getWorkerUtilization();
      return this.successResponse(res, utilizationStats);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get construction site statistics
  static async getSiteStats(req, res) {
    try {
      const { status } = req.query;
      let sites;
      
      if (status) {
        sites = await ConstructionSiteModel.findByStatus(status);
      } else {
        sites = await ConstructionSiteModel.findAll();
      }
      
      const stats = {
        total: sites.length,
        byStatus: {},
        byStakeholder: {},
        upcoming: 0,
        inProgress: 0,
        completed: 0,
        delayed: 0
      };
      
      // Count by status
      sites.forEach(site => {
        // Initialize status count if not exists
        if (!stats.byStatus[site.status]) {
          stats.byStatus[site.status] = 0;
        }
        stats.byStatus[site.status]++;
        
        // Count by stakeholder
        if (!stats.byStakeholder[site.stakeholder_id]) {
          stats.byStakeholder[site.stakeholder_id] = 0;
        }
        stats.byStakeholder[site.stakeholder_id]++;
        
        // Count by timeline
        const today = new Date();
        const startDate = new Date(site.start_date);
        const endDate = site.end_date ? new Date(site.end_date) : null;
        
        if (startDate > today) {
          stats.upcoming++;
        } else if (endDate && endDate < today) {
          stats.completed++;
        } else if (endDate && endDate < today) {
          stats.delayed++;
        } else {
          stats.inProgress++;
        }
      });
      
      return this.successResponse(res, stats);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get worker statistics
  static async getWorkersStats(req, res) {
    try {
      const workers = await UserAccountModel.findByType('worker');
      
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
          ConstructionSiteModel.getWorkerCount(worker.id)
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
      
      return this.successResponse(res, stats);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get stakeholder statistics
  static async getStakeholderStats(req, res) {
    try {
      const { StatsModel } = require('../models');
      const stats = await StatsModel.getStakeholderStats();
      return this.successResponse(res, stats);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }
}

module.exports = StatsController;
