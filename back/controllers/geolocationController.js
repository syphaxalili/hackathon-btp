const BaseController = require('./baseController');
const { GeolocationModel } = require('../models');

class GeolocationController extends BaseController {
  // Create a new geolocation
  static async create(req, res) {
    try {
      const geolocationId = await GeolocationModel.create(req.body);
      const newGeolocation = await GeolocationModel.findById(geolocationId);
      return this.successResponse(res, newGeolocation, 201);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get a geolocation by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const geolocation = await GeolocationModel.findById(id);
      
      if (!geolocation) {
        return this.notFoundResponse(res, 'Geolocation');
      }
      
      return this.successResponse(res, geolocation);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Update a geolocation
  static async update(req, res) {
    try {
      const { id } = req.params;
      const geolocation = await GeolocationModel.findById(id);
      
      if (!geolocation) {
        return this.notFoundResponse(res, 'Geolocation');
      }
      
      await GeolocationModel.update(id, req.body);
      const updatedGeolocation = await GeolocationModel.findById(id);
      
      return this.successResponse(res, updatedGeolocation);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Delete a geolocation
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const geolocation = await GeolocationModel.findById(id);
      
      if (!geolocation) {
        return this.notFoundResponse(res, 'Geolocation');
      }
      
      await GeolocationModel.delete(id);
      return this.successResponse(res, { id }, 204);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }
}

module.exports = GeolocationController;
