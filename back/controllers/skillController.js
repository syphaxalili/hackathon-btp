const { successResponse, errorResponse, notFoundResponse } = require('./utils');

class skillController {
  // Create a new skill
  static async create(req, res) {
    try {
      const { name, CategoryId } = req.body;
      const { Skill, Category } = req.models;
      
      // Validate input
      if (!name || !CategoryId) {
        return errorResponse(res, 'Name and CategoryId are required', 400);
      }
      
      const category = await Category.findByPk(CategoryId);
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      const skillId = await Skill.create({ name, CategoryId });
      const serializedSkillId =
        skillId && skillId.toJSON ? skillId.toJSON() : skillId;
      const newSkill = await Skill.findByPk(serializedSkillId.id);
      
      return successResponse(res, newSkill, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all skills with category information
  static async getAll(req, res) {
    try {
      const { Skill } = req.models;
      const skills = await Skill.findAll();
      return successResponse(res, skills);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a skill by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { Skill } = req.models;
      const skill = await Skill.findByPk(id);
      
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
      const { Skill, Category } = req.models;
      
      // Check if category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return notFoundResponse(res, 'Category');
      }
      
      const skills = await Skill.findByCategory(categoryId);
      return successResponse(res, skills);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a skill
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, CategoryId } = req.body;
      const { Skill, Category } = req.models;
      
      const skill = await Skill.findByPk(id);
      if (!skill) {
        return notFoundResponse(res, 'Skill');
      }
      
      if (CategoryId && CategoryId !== skill.CategoryId) {
        const category = await Category.findByPk(CategoryId);
        if (!category) {
          return notFoundResponse(res, 'Category');
        }
      }
      
      await Skill.update({ 
        name: name || skill.name, 
        description: description || skill.description,
        CategoryId: CategoryId || skill.CategoryId 
      }, { where: { id } });
      
      
      const updatedSkill = await Skill.findByPk(id);
      return successResponse(res, updatedSkill);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a skill
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { Skill } = req.models;
      const skill = await Skill.findByPk(id);
      
      if (!skill) {
        return notFoundResponse(res, 'Skill');
      }
      
      await Skill.destroy({ where: { id } });
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = skillController;
