const { successResponse, errorResponse, notFoundResponse } = require('./utils');
const { PeriodicityModel, ConstructionSiteModel } = require('../models');

class PeriodicityController {
  // Create a new periodicity
  static async create(req, res) {
    try {
      const { 
        name, 
        description, 
        start_date, 
        end_date, 
        frequency, 
        construction_sites = [] 
      } = req.body;
      
      // Validate required fields
      if (!name || !start_date || !end_date || !frequency) {
        return errorResponse(
          res, 
          'Name, start_date, end_date, and frequency are required', 
          400
        );
      }
      
      // Validate frequency
      const validFrequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
      if (!validFrequencies.includes(frequency)) {
        return errorResponse(
          res, 
          `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`,
          400
        );
      }
      
      // Validate construction sites exist
      for (const siteId of construction_sites) {
        const site = await ConstructionSiteModel.findById(siteId);
        if (!site) {
          return notFoundResponse(res, `Construction site with ID ${siteId}`);
        }
      }
      
      // Create periodicity
      const periodicityId = await PeriodicityModel.create({
        name,
        description,
        start_date,
        end_date,
        frequency
      });
      
      // Add construction sites to periodicity
      for (const siteId of construction_sites) {
        await PeriodicityModel.addConstructionSite(periodicityId, siteId);
      }
      
      const newPeriodicity = await PeriodicityModel.findById(periodicityId);
      return successResponse(res, newPeriodicity, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all periodicities
  static async getAll(req, res) {
    try {
      const { start_date, end_date } = req.query;
      let periodicities;
      
      if (start_date && end_date) {
        periodicities = await PeriodicityModel.findByDateRange(start_date, end_date);
      } else {
        periodicities = await PeriodicityModel.findAll();
      }
      
      return successResponse(res, periodicities);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a periodicity by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const periodicity = await PeriodicityModel.findById(id);
      
      if (!periodicity) {
        return notFoundResponse(res, 'Periodicity');
      }
      
      // Get associated construction sites
      const constructionSites = await PeriodicityModel.getConstructionSites(id);
      
      return successResponse(res, {
        ...periodicity,
        construction_sites: constructionSites
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a periodicity
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { 
        name, 
        description, 
        start_date, 
        end_date, 
        frequency,
        construction_sites
      } = req.body;
      
      // Check if periodicity exists
      const periodicity = await PeriodicityModel.findById(id);
      if (!periodicity) {
        return notFoundResponse(res, 'Periodicity');
      }
      
      // Validate frequency if provided
      if (frequency) {
        const validFrequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
        if (!validFrequencies.includes(frequency)) {
          return errorResponse(
            res, 
            `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}`,
            400
          );
        }
      }
      
      // Update periodicity
      await PeriodicityModel.update(id, {
        name: name || periodicity.name,
        description: description !== undefined ? description : periodicity.description,
        start_date: start_date || periodicity.start_date,
        end_date: end_date || periodicity.end_date,
        frequency: frequency || periodicity.frequency
      });
      
      // Update construction sites if provided
      if (Array.isArray(construction_sites)) {
        // Remove all existing associations
        const existingSites = await PeriodicityModel.getConstructionSites(id);
        for (const site of existingSites) {
          await PeriodicityModel.removeConstructionSite(id, site.id);
        }
        
        // Add new associations
        for (const siteId of construction_sites) {
          const site = await ConstructionSiteModel.findById(siteId);
          if (site) {
            await PeriodicityModel.addConstructionSite(id, siteId);
          }
        }
      }
      
      const updatedPeriodicity = await PeriodicityModel.findById(id);
      const updatedSites = await PeriodicityModel.getConstructionSites(id);
      
      return successResponse(res, {
        ...updatedPeriodicity,
        construction_sites: updatedSites
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a periodicity
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const periodicity = await PeriodicityModel.findById(id);
      
      if (!periodicity) {
        return notFoundResponse(res, 'Periodicity');
      }
      
      // Remove all construction site associations
      const constructionSites = await PeriodicityModel.getConstructionSites(id);
      for (const site of constructionSites) {
        await PeriodicityModel.removeConstructionSite(id, site.id);
      }
      
      // Delete the periodicity
      await PeriodicityModel.delete(id);
      
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Add a construction site to a periodicity
  static async addConstructionSite(req, res) {
    try {
      const { periodicityId, siteId } = req.params;
      
      // Check if periodicity exists
      const periodicity = await PeriodicityModel.findById(periodicityId);
      if (!periodicity) {
        return notFoundResponse(res, 'Periodicity');
      }
      
      // Check if construction site exists
      const site = await ConstructionSiteModel.findById(siteId);
      if (!site) {
        return notFoundResponse(res, 'Construction site');
      }
      
      // Check if the association already exists
      const sites = await PeriodicityModel.getConstructionSites(periodicityId);
      if (sites.some(s => s.id === parseInt(siteId))) {
        return errorResponse(res, 'Construction site is already associated with this periodicity', 400);
      }
      
      await PeriodicityModel.addConstructionSite(periodicityId, siteId);
      
      const updatedPeriodicity = await PeriodicityModel.findById(periodicityId);
      const updatedSites = await PeriodicityModel.getConstructionSites(periodicityId);
      
      return successResponse(res, {
        ...updatedPeriodicity,
        construction_sites: updatedSites
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Remove a construction site from a periodicity
  static async removeConstructionSite(req, res) {
    try {
      const { periodicityId, siteId } = req.params;
      
      // Check if periodicity exists
      const periodicity = await PeriodicityModel.findById(periodicityId);
      if (!periodicity) {
        return notFoundResponse(res, 'Periodicity');
      }
      
      await PeriodicityModel.removeConstructionSite(periodicityId, siteId);
      
      const updatedPeriodicity = await PeriodicityModel.findById(periodicityId);
      const updatedSites = await PeriodicityModel.getConstructionSites(periodicityId);
      
      return successResponse(res, {
        ...updatedPeriodicity,
        construction_sites: updatedSites
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = PeriodicityController;
