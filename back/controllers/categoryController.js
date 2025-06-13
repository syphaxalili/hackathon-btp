const { successResponse, errorResponse, notFoundResponse } = require('./utils');

class CategoryController {
  // Create a new category
  static async create(req, res) {
    try {
      const { name } = req.body;
      const { Category } = req.models;
      
      if (!name) {
        return errorResponse(res, 'Name is required', 400);
      }
      
      const categoryId = await Category.create(name);
      const newCategory = await Category.findById(categoryId);
      
      return successResponse(res, newCategory, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all categories
  static async getAll(req, res) {
    try {
      const { Category } = req.models;
      const categories = await Category.findAll();
      return successResponse(res, categories);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a category by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { Category } = req.models;
      const category = await Category.findById(id);
      
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      return successResponse(res, category);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a category
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const { Category } = req.models;
      
      if (!name) {
        return errorResponse(res, 'Name is required', 400);
      }
      
      const category = await Category.findById(id);
      
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      await Category.update(id, name);
      const updatedCategory = await Category.findById(id);
      
      return successResponse(res, updatedCategory);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a category
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { Category } = req.models;
      const category = await Category.findById(id);
      
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      await Category.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = CategoryController;
