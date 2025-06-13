const { successResponse, errorResponse, notFoundResponse } = require('./utils');

class SkillsListController {
  // Create a new skill
  static async create(req, res) {
    try {
      const { name, category_id } = req.body;
      const { SkillsList, Category } = req.models;
      
      // Validate input
      if (!name || !category_id) {
        return errorResponse(res, 'Name and category_id are required', 400);
      }
      
      // Check if category exists
      const category = await Category.findById(category_id);
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      const skillId = await SkillsList.create({ name, category_id });
      const newSkill = await SkillsList.findById(skillId);
      
      return successResponse(res, newSkill, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all skills with category information
  static async getAll(req, res) {
    try {
      const { SkillsList } = req.models;
      const skills = await SkillsList.findAll();
      return successResponse(res, skills);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a skill by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { SkillsList } = req.models;
      const skill = await SkillsList.findById(id);
      
      if (!skill) {
        return notFoundResponse(res, 'Skill');
      }
      
      return successResponse(res, skill);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get skills by category ID
  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { SkillsList, Category } = req.models;
      
      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      const skills = await SkillsList.findByCategory(categoryId);
      return successResponse(res, skills);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a skill
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, category_id } = req.body;
      const { SkillsList, Category } = req.models;
      
      // Check if skill exists
      const skill = await SkillsList.findById(id);
      if (!skill) {
        return notFoundResponse(res, 'Skill');
      }
      
      // If updating category_id, check if the new category exists
      if (category_id && category_id !== skill.category_id) {
        const category = await Category.findById(category_id);
        if (!category) {
          return notFoundResponse(res, 'Category');
        }
      }
      
      await SkillsList.update(id, { 
        name: name || skill.name, 
        category_id: category_id || skill.category_id 
      });
      
      const updatedSkill = await SkillsList.findById(id);
      return successResponse(res, updatedSkill);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a skill
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { SkillsList } = req.models;
      const skill = await SkillsList.findById(id);
      
      if (!skill) {
        return notFoundResponse(res, 'Skill');
      }
      
      await SkillsList.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = SkillsListController;
