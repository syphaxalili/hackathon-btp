const { successResponse, errorResponse, notFoundResponse } = require("./utils");

class StakeHoldersController {
  // Create a new stakeholder
  static async create(req, res) {
    try {
      const { name, tax_number, vat_number, address, ...otherData } = req.body;
      const { StakeHolder } = req.models;

      // Validate required fields
      if (!name || !tax_number) {
        return errorResponse(
          res,
          "Name and contact tax_number are required",
          400
        );
      }

      const stakeholderId = await StakeHolder.create({
        name: name,
        tax_number: tax_number,
        vat_number: vat_number,
        address: address,
        ...otherData,
      });

      return successResponse(res, stakeholderId, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all stakeholders
  static async getAll(req, res) {
    try {
      const { StakeHolder } = req.models;
      const stakeholders = await StakeHolder.findAll();
      return successResponse(res, stakeholders);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a stakeholder by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { StakeHolder } = req.models;
      const stakeholder = await StakeHolder.findById(id);

      if (!stakeholder) {
        return notFoundResponse(res, "Stakeholder");
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
      const { StakeHolder } = req.models;
      const stakeholder = await StakeHolder.findById(id);
      if (!stakeholder) {
        return notFoundResponse(res, "Stakeholder");
      }

      // Prevent updating certain fields directly
      const { id: _, created_at, ...validUpdates } = updateData;

      await StakeHolder.update(id, validUpdates);
      const updatedStakeholder = await StakeHolder.findById(id);

      return successResponse(res, updatedStakeholder);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a stakeholder
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { StakeHolder } = req.models;
      const stakeholder = await StakeHolder.findById(id);

      if (!stakeholder) {
        return notFoundResponse(res, "Stakeholder");
      }

      await StakeHolder.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = StakeHoldersController;
