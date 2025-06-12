const BaseController = require('./baseController');
const { 
  ConstructionSiteModel, 
  UserAccountModel, 
  SkillsListModel,
  StakeHoldersModel 
} = require('../models');

class ConstructionSiteController extends BaseController {
  // Create a new construction site
  static async create(req, res) {
    try {
      const { 
        name, 
        description, 
        start_date, 
        end_date, 
        status, 
        stakeholder_id,
        required_skills,
        ...otherData 
      } = req.body;
      
      // Validate required fields
      if (!name || !start_date || !stakeholder_id) {
        return this.errorResponse(res, 'Name, start_date, and stakeholder_id are required', 400);
      }
      
      // Check if stakeholder exists
      const stakeholder = await StakeHoldersModel.findById(stakeholder_id);
      if (!stakeholder) {
        return this.notFoundResponse(res, 'Stakeholder');
      }
      
      // Create construction site
      const siteId = await ConstructionSiteModel.create({
        name,
        description,
        start_date,
        end_date,
        status: status || 'planned',
        stakeholder_id,
        ...otherData
      });
      
      // Add required skills if provided
      if (required_skills && Array.isArray(required_skills)) {
        for (const skillId of required_skills) {
          const skill = await SkillsListModel.findById(skillId);
          if (skill) {
            await ConstructionSiteModel.addRequiredSkill(siteId, skillId);
          }
        }
      }
      
      const newSite = await ConstructionSiteModel.findById(siteId);
      return this.successResponse(res, newSite, 201);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get all construction sites
  static async getAll(req, res) {
    try {
      const { status, stakeholder } = req.query;
      let sites;
      
      if (status) {
        sites = await ConstructionSiteModel.findByStatus(status);
      } else if (stakeholder) {
        sites = await ConstructionSiteModel.findByStakeholder(stakeholder);
      } else {
        sites = await ConstructionSiteModel.findAll();
      }
      
      return this.successResponse(res, sites);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get a construction site by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const site = await ConstructionSiteModel.findById(id);
      
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      // Get additional details
      const [workers, requiredSkills] = await Promise.all([
        ConstructionSiteModel.getWorkers(id),
        ConstructionSiteModel.getRequiredSkills(id)
      ]);
      
      return this.successResponse(res, {
        ...site,
        workers,
        required_skills: requiredSkills
      });
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Update a construction site
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(id);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      // If updating stakeholder_id, check if the new stakeholder exists
      if (updateData.stakeholder_id && updateData.stakeholder_id !== site.stakeholder_id) {
        const stakeholder = await StakeHoldersModel.findById(updateData.stakeholder_id);
        if (!stakeholder) {
          return this.notFoundResponse(res, 'Stakeholder');
        }
      }
      
      await ConstructionSiteModel.update(id, updateData);
      const updatedSite = await ConstructionSiteModel.findById(id);
      
      return this.successResponse(res, updatedSite);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Update construction site status
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return this.errorResponse(res, 'Status is required', 400);
      }
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(id);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSiteModel.updateStatus(id, status);
      const updatedSite = await ConstructionSiteModel.findById(id);
      
      return this.successResponse(res, updatedSite);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Delete a construction site
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const site = await ConstructionSiteModel.findById(id);
      
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSiteModel.delete(id);
      return this.successResponse(res, { id }, 204);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Assign a worker to a construction site
  static async assignWorker(req, res) {
    try {
      const { siteId, workerId } = req.params;
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(siteId);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      // Check if worker exists and is actually a worker
      const worker = await UserAccountModel.findById(workerId);
      if (!worker || worker.user_type !== 'worker') {
        return this.errorResponse(res, 'Invalid worker', 400);
      }
      
      await ConstructionSiteModel.assignWorker(siteId, workerId);
      await ConstructionSiteModel.updateWorkerCount(siteId);
      
      const updatedSite = await ConstructionSiteModel.findById(siteId);
      return this.successResponse(res, updatedSite);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Remove a worker from a construction site
  static async removeWorker(req, res) {
    try {
      const { siteId, workerId } = req.params;
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(siteId);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSiteModel.removeWorker(siteId, workerId);
      await ConstructionSiteModel.updateWorkerCount(siteId);
      
      const updatedSite = await ConstructionSiteModel.findById(siteId);
      return this.successResponse(res, updatedSite);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Add a required skill to a construction site
  static async addRequiredSkill(req, res) {
    try {
      const { siteId, skillId } = req.params;
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(siteId);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      // Check if skill exists
      const skill = await SkillsListModel.findById(skillId);
      if (!skill) {
        return this.notFoundResponse(res, 'Skill');
      }
      
      await ConstructionSiteModel.addRequiredSkill(siteId, skillId);
      const updatedSite = await ConstructionSiteModel.findById(siteId);
      
      return this.successResponse(res, updatedSite);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Remove a required skill from a construction site
  static async removeRequiredSkill(req, res) {
    try {
      const { siteId, skillId } = req.params;
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(siteId);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSiteModel.removeRequiredSkill(siteId, skillId);
      const updatedSite = await ConstructionSiteModel.findById(siteId);
      
      return this.successResponse(res, updatedSite);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Find compatible workers for a construction site
  static async findCompatibleWorkers(req, res) {
    try {
      const { siteId } = req.params;
      
      // Check if site exists
      const site = await ConstructionSiteModel.findById(siteId);
      if (!site) {
        return this.notFoundResponse(res, 'Construction site');
      }
      
      const compatibleWorkers = await ConstructionSiteModel.findCompatibleWorkers(siteId);
      
      return this.successResponse(res, compatibleWorkers);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }
}

module.exports = ConstructionSiteController;
