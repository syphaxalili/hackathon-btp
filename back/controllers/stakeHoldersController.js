const BaseController = require('./baseController');
const { StakeHoldersModel } = require('../models');

class StakeHoldersController extends BaseController {
  // Create a new stakeholder
  static async create(req, res) {
    try {
      const { name, description, contact_email, contact_phone, ...otherData } = req.body;
      
      // Validate required fields
      if (!name || !contact_email) {
        return this.errorResponse(res, 'Name and contact email are required', 400);
      }
      
      const stakeholderId = await StakeHoldersModel.create({
        name,
        description,
        contact_email,
        contact_phone,
        ...otherData
      });
      
      const newStakeholder = await StakeHoldersModel.findById(stakeholderId);
      return this.successResponse(res, newStakeholder, 201);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get all stakeholders
  static async getAll(req, res) {
    try {
      const stakeholders = await StakeHoldersModel.findAll();
      return this.successResponse(res, stakeholders);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get a stakeholder by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const stakeholder = await StakeHoldersModel.findById(id);
      
      if (!stakeholder) {
        return this.notFoundResponse(res, 'Stakeholder');
      }
      
      return this.successResponse(res, stakeholder);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Update a stakeholder
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Check if stakeholder exists
      const stakeholder = await StakeHoldersModel.findById(id);
      if (!stakeholder) {
        return this.notFoundResponse(res, 'Stakeholder');
      }
      
      // Prevent updating certain fields directly
      const { id: _, created_at, ...validUpdates } = updateData;
      
      await StakeHoldersModel.update(id, validUpdates);
      const updatedStakeholder = await StakeHoldersModel.findById(id);
      
      return this.successResponse(res, updatedStakeholder);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Delete a stakeholder
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const stakeholder = await StakeHoldersModel.findById(id);
      
      if (!stakeholder) {
        return this.notFoundResponse(res, 'Stakeholder');
      }
      
      await StakeHoldersModel.delete(id);
      return this.successResponse(res, { id }, 204);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }
}

module.exports = StakeHoldersController;
