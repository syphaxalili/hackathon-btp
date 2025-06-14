const { successResponse, errorResponse, notFoundResponse } = require('./utils');

class ConstructionSiteController {
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
      const { ConstructionSite, StakeHolder, Skill } = req.models;

      // Validate required fields
      if (!name || !start_date || !stakeholder_id) {
        return errorResponse(res, 'Name, start_date, and stakeholder_id are required', 400);
      }
      
      // Check if stakeholder exists
      const stakeholder = await StakeHolder.findById(stakeholder_id);
      if (!stakeholder) {
        return notFoundResponse(res, 'Stakeholder');
      }
      
      // Create construction site
      const siteId = await ConstructionSite.create({
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
          const skill = await Skill.findById(skillId);
          if (skill) {
            await ConstructionSite.addRequiredSkill(siteId, skillId);
          }
        }
      }
      
      const newSite = await ConstructionSite.findById(siteId);
      return successResponse(res, newSite, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all construction sites
  static async getAll(req, res) {
    try {
      const { status, stakeholder } = req.query;
      const { ConstructionSite } = req.models;
      let sites;
      
      if (status) {
        sites = await ConstructionSite.findByStatus(status);
      } else if (stakeholder) {
        sites = await ConstructionSite.findByStakeholder(stakeholder);
      } else {
        sites = await ConstructionSite.findAll();
      }
      
      return successResponse(res, sites);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a construction site by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { ConstructionSite } = req.models;
      const site = await ConstructionSite.findById(id);
      
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      // Get additional details
      const [workers, requiredSkills] = await Promise.all([
        ConstructionSite.getWorkers(id),
        ConstructionSite.getRequiredSkills(id)
      ]);
      
      return successResponse(res, {
        ...site,
        workers,
        required_skills: requiredSkills
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a construction site
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { ConstructionSite, StakeHolder } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(id);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      // If updating stakeholder_id, check if the new stakeholder exists
      if (updateData.stakeholder_id && updateData.stakeholder_id !== site.stakeholder_id) {
        const stakeholder = await StakeHolder.findById(updateData.stakeholder_id);
        if (!stakeholder) {
          return notFoundResponse(res, 'Stakeholder');
        }
      }
      
      await ConstructionSite.update(id, updateData);
      const updatedSite = await ConstructionSite.findById(id);
      
      return successResponse(res, updatedSite);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update construction site status
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { ConstructionSite } = req.models;
      
      if (!status) {
        return errorResponse(res, 'Status is required', 400);
      }
      
      // Check if site exists
      const site = await ConstructionSite.findById(id);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSite.updateStatus(id, status);
      const updatedSite = await ConstructionSite.findById(id);
      
      return successResponse(res, updatedSite);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a construction site
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { ConstructionSite } = req.models;
      const site = await ConstructionSite.findById(id);
      
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSite.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  
  // Get all workers from a construction site
  static async getWorkers(req, res) {
    try {
      const { siteId } = req.params;
      const { ConstructionSite } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      const workers = await ConstructionSite.getWorkers(siteId);
      return successResponse(res, workers);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Assign a worker to a construction site
  static async assignWorker(req, res) {
    try {
      const { siteId, workerId } = req.params;
      const { ConstructionSite, UserAccount } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      // Check if worker exists and is actually a worker
      const worker = await UserAccount.findById(workerId);
      if (!worker || worker.user_type !== 'worker') {
        return errorResponse(res, 'Invalid worker', 400);
      }
      
      await ConstructionSite.assignWorker(siteId, workerId);
      await ConstructionSite.updateWorkerCount(siteId);
      
      const updatedSite = await ConstructionSite.findById(siteId);
      return successResponse(res, updatedSite);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Remove a worker from a construction site
  static async removeWorker(req, res) {
    try {
      const { siteId, workerId } = req.params;
      const { ConstructionSite } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSite.removeWorker(siteId, workerId);
      await ConstructionSite.updateWorkerCount(siteId);
      
      const updatedSite = await ConstructionSite.findById(siteId);
      return successResponse(res, updatedSite);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Add a required skill to a construction site
  static async addRequiredSkill(req, res) {
    try {
      const { siteId, skillId } = req.params;
      const { ConstructionSite, Skill } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      // Check if skill exists
      const skill = await Skill.findById(skillId);
      if (!skill) {
        return notFoundResponse(res, 'Skill');
      }
      
      await ConstructionSite.addRequiredSkill(siteId, skillId);
      const updatedSite = await ConstructionSite.findById(siteId);
      
      return successResponse(res, updatedSite);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Remove a required skill from a construction site
  static async removeRequiredSkill(req, res) {
    try {
      const { siteId, skillId } = req.params;
      const { ConstructionSite } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      await ConstructionSite.removeRequiredSkill(siteId, skillId);
      const updatedSite = await ConstructionSite.findById(siteId);
      
      return successResponse(res, updatedSite);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Find compatible workers for a construction site
  static async findCompatibleWorkers(req, res) {
    try {
      const { siteId } = req.params;
      const { ConstructionSite } = req.models;
      
      // Check if site exists
      const site = await ConstructionSite.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      const compatibleWorkers = await ConstructionSite.findCompatibleWorkers(siteId);
      
      return successResponse(res, compatibleWorkers);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = ConstructionSiteController;
