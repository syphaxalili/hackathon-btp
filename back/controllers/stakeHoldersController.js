const { successResponse, errorResponse, notFoundResponse } = require('./utils');
const { StakeHoldersModel } = require('../models');

class StakeHoldersController {
  // Create a new stakeholder
  static async create(req, res) {
    try {
      const { name, description, contact_email, contact_phone, ...otherData } = req.body;
      
      // Validate required fields
      if (!name || !contact_email) {
        return errorResponse(res, 'Name and contact email are required', 400);
      }
      
      const stakeholderId = await StakeHoldersModel.create({
        name,
        description,
        contact_email,
        contact_phone,
        ...otherData
      });
      
      const newStakeholder = await StakeHoldersModel.findById(stakeholderId);
      return successResponse(res, newStakeholder, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all stakeholders
  static async getAll(req, res) {
    try {
      const stakeholders = await StakeHoldersModel.findAll();
      return successResponse(res, stakeholders);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a stakeholder by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const stakeholder = await StakeHoldersModel.findById(id);
      
      if (!stakeholder) {
        return notFoundResponse(res, 'Stakeholder');
      }
      
      return successResponse(res, stakeholder);
    } catch (error) {
      return errorResponse(res, error.message);
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
        return notFoundResponse(res, 'Stakeholder');
      }
      
      // Prevent updating certain fields directly
      const { id: _, created_at, ...validUpdates } = updateData;
      
      await StakeHoldersModel.update(id, validUpdates);
      const updatedStakeholder = await StakeHoldersModel.findById(id);
      
      return successResponse(res, updatedStakeholder);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a stakeholder
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const stakeholder = await StakeHoldersModel.findById(id);
      
      if (!stakeholder) {
        return notFoundResponse(res, 'Stakeholder');
      }
      
      await StakeHoldersModel.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = StakeHoldersController;
