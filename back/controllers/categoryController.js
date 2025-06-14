const { successResponse, errorResponse, notFoundResponse } = require('./utils');

class CategoryController {
  // Create a new category
  static async create(req, res) {
    try {
      const name = req.body;
      const { Category } = req.models;

      if (!name) {
        return errorResponse(res, "Name is required", 400);
      }

      const categoryId = await Category.create(name);
      const serializedCategory =
        categoryId && categoryId.toJSON ? categoryId.toJSON() : categoryId;
      const newCategory = await Category.findByPk(serializedCategory.id);

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
      const {name} = req.body;
      const { Category } = req.models;
      
      if (!name) {
        return errorResponse(res, 'Name is required', 400);
      }
      
      const category = await Category.findByPk(id);
      
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      await Category.update({ name }, { where: { id } });
      const updatedCategory = await Category.findByPk(id);
      
      return successResponse(res, updatedCategory);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { Category } = req.models;
      const category = await Category.findByPk(id);
  
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
  
      await category.destroy();
  
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = CategoryController;
