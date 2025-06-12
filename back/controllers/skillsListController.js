const BaseController = require('./baseController');
const { SkillsListModel, CategoryModel } = require('../models');

class SkillsListController extends BaseController {
  // Create a new skill
  static async create(req, res) {
    try {
      const { name, category_id } = req.body;
      
      // Validate input
      if (!name || !category_id) {
        return this.errorResponse(res, 'Name and category_id are required', 400);
      }
      
      // Check if category exists
      const category = await CategoryModel.findById(category_id);
      if (!category) {
        return this.notFoundResponse(res, 'Category');
      }
      
      const skillId = await SkillsListModel.create({ name, category_id });
      const newSkill = await SkillsListModel.findById(skillId);
      
      return this.successResponse(res, newSkill, 201);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get all skills with category information
  static async getAll(req, res) {
    try {
      const skills = await SkillsListModel.findAll();
      return this.successResponse(res, skills);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get a skill by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const skill = await SkillsListModel.findById(id);
      
      if (!skill) {
        return this.notFoundResponse(res, 'Skill');
      }
      
      return this.successResponse(res, skill);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Get skills by category ID
  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      
      // Check if category exists
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return this.notFoundResponse(res, 'Category');
      }
      
      const skills = await SkillsListModel.findByCategory(categoryId);
      return this.successResponse(res, skills);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Update a skill
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, category_id } = req.body;
      
      // Check if skill exists
      const skill = await SkillsListModel.findById(id);
      if (!skill) {
        return this.notFoundResponse(res, 'Skill');
      }
      
      // If updating category_id, check if the new category exists
      if (category_id && category_id !== skill.category_id) {
        const category = await CategoryModel.findById(category_id);
        if (!category) {
          return this.notFoundResponse(res, 'Category');
        }
      }
      
      await SkillsListModel.update(id, { 
        name: name || skill.name, 
        category_id: category_id || skill.category_id 
      });
      
      const updatedSkill = await SkillsListModel.findById(id);
      return this.successResponse(res, updatedSkill);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }

  // Delete a skill
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const skill = await SkillsListModel.findById(id);
      
      if (!skill) {
        return this.notFoundResponse(res, 'Skill');
      }
      
      await SkillsListModel.delete(id);
      return this.successResponse(res, { id }, 204);
    } catch (error) {
      return this.errorResponse(res, error.message);
    }
  }
}

module.exports = SkillsListController;
