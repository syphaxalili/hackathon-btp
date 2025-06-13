const { successResponse, errorResponse, notFoundResponse } = require('./utils');

class GeolocationController {
  // Create a new geolocation
  static async create(req, res) {
    try {
      const { Geolocation } = req.models;
      const geolocationId = await Geolocation.create(req.body);
      const newGeolocation = await Geolocation.findById(geolocationId);
      return successResponse(res, newGeolocation, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a geolocation by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { Geolocation } = req.models;
      const geolocation = await Geolocation.findById(id);
      
      if (!geolocation) {
        return notFoundResponse(res, 'Geolocation');
      }
      
      return successResponse(res, geolocation);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a geolocation
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { Geolocation } = req.models;
      const geolocation = await Geolocation.findById(id);
      
      if (!geolocation) {
        return notFoundResponse(res, 'Geolocation');
      }
      
      await Geolocation.update(id, req.body);
      const updatedGeolocation = await Geolocation.findById(id);
      
      return successResponse(res, updatedGeolocation);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a geolocation
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { Geolocation } = req.models;
      const geolocation = await Geolocation.findById(id);
      
      if (!geolocation) {
        return notFoundResponse(res, 'Geolocation');
      }
      
      await Geolocation.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = GeolocationController;
