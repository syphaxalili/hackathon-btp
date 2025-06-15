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

      // On filtre avec is_actif: true
      const stakeholders = await StakeHolder.findAll({
        where: { is_actif: true },
      });

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

      const stakeholder = await StakeHolder.findOne({
        where: {
          id,
          is_actif: true, // Vérifie aussi qu’il est actif
        },
      });

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
      const { StakeHolder } = req.models;

      // Vérifie qu’il existe ET qu’il est actif
      const stakeholder = await StakeHolder.findOne({
        where: {
          id,
          is_actif: true,
        },
      });

      if (!stakeholder) {
        return notFoundResponse(res, "Stakeholder");
      }

      // Exclure certains champs sensibles
      const { id: _, created_at, ...validUpdates } = updateData;

      await StakeHolder.update(validUpdates, {
        where: { id },
      });

      const updatedStakeholder = await StakeHolder.findByPk(id);
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
      const stakeholder = await StakeHolder.findByPk(id);

      if (!stakeholder) {
        return notFoundResponse(res, "Stakeholder");
      }

      await StakeHolder.update({ is_actif: false }, { where: { id } });
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = StakeHoldersController;
