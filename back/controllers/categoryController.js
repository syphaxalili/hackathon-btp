const BaseController = require('./baseController');
const { CategoryModel } = require('../models');

class CategoryController extends BaseController {
  // Create a new category
  static async create(req, res) {
    try {
      const { name } = req.body;
      
      if (!name) {
        return this.errorResponse(res, 'Name is required', 400);
      }
      
      const categoryId = await CategoryModel.create(name);
      const newCategory = await CategoryModel.findById(categoryId);
      
      return this.successResponse(res, newCategory, 201);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get all categories
  static async getAll(req, res) {
    try {
      const categories = await CategoryModel.findAll();
      return this.successResponse(res, categories);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get a category by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findById(id);
      
      if (!category) {
        return this.notFoundResponse(res, 'Category');
      }
      
      return this.successResponse(res, category);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Update a category
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name) {
        return this.errorResponse(res, 'Name is required', 400);
      }
      
      const category = await CategoryModel.findById(id);
      
      if (!category) {
        return this.notFoundResponse(res, 'Category');
      }
      
      await CategoryModel.update(id, name);
      const updatedCategory = await CategoryModel.findById(id);
      
      return this.successResponse(res, updatedCategory);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Delete a category
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.findById(id);
      
      if (!category) {
        return this.notFoundResponse(res, 'Category');
      }
      
      await CategoryModel.delete(id);
      return this.successResponse(res, { id }, 204);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }
}

module.exports = CategoryController;
