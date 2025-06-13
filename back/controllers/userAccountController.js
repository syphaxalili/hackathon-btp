const { successResponse, errorResponse, notFoundResponse } = require("./utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserAccountController {
  // Create a new user account
  static async create(req, res) {
    try {
      const { UserAccount } = req.models; 

      const { email, password, user_type, firstname, lastname, ...userData } =
        req.body;

      // Validate required fields
      if (!email || !password || !user_type || !firstname || !lastname) {
        return errorResponse(
          res,
          "Email, password, user_type, firstname, and lastname are required",
          400
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserAccount.create({
        email,
        password: hashedPassword,
        user_type,
        first_name: firstname,
        last_name: lastname,
        ...userData,
      });

      // Supprime le champ password du retour
      const userJson = newUser.toJSON();
      delete userJson.password;

      // Remove sensitive data from response
      delete newUser.password_hash;

      return successResponse(res, newUser, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Login a user and return a JWT token in a cookie
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, "Email and password are required", 400);
      }

      // 1. Vérifie si l'utilisateur existe
      const { UserAccount } = req.models;
      const user = await UserAccount.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, "Invalid email or password", 401);
      }

      // 2. Compare le mot de passe
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return errorResponse(res, "Invalid email or password", 401);
      }

      // 3. Génère le token JWT
      const payload = {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
      };
      const token = jwt.sign(payload, "dev-secret", {
        expiresIn: "1d",
      });

      // 4. Supprime le mot de passe de l'objet renvoyé
      delete user.password_hash;

      // 5. Envoie le token dans un cookie sécurisé
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
      });

      return successResponse(res, { user, token });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all users (with optional filtering by type)
  static async getAll(req, res) {
    try {
      const { UserAccount } = req.models;
      const { type } = req.query;
      let users;

      if (type) {
        users = await UserAccount.findByType(type);
      } else {
        users = await UserAccount.findAll();
      }

      // Remove sensitive data from response
      users = users.map((user) => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return successResponse(res, users);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get a user by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const { UserAccount } = req.models;
      const user = await UserAccount.findById(id);

      if (!user) {
        return notFoundResponse(res, "User");
      }

      // Remove sensitive data from response
      const { password_hash, ...userWithoutPassword } = user;

      return successResponse(res, userWithoutPassword);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update a user
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { password, ...updateData } = req.body;
      const { UserAccount } = req.models;

      // Check if user exists
      const user = await UserAccount.findById(id);
      if (!user) {
        return notFoundResponse(res, "User");
      }

      // If password is being updated, hash it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserAccount.updatePassword(id, hashedPassword);
      }

      // Update other user data if provided
      if (Object.keys(updateData).length > 0) {
        await UserAccount.update(id, updateData);
      }
      
      const updatedUser = await UserAccount.findById(id);

      // Remove sensitive data from response
      delete updatedUser.password_hash;

      return successResponse(res, updatedUser);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete a user
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await UserAccountModel.findById(id);

      if (!user) {
        return notFoundResponse(res, "User");
      }

      const { UserAccount } = req.models;
      await UserAccount.delete(id);
      return successResponse(res, { id }, 204);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get current user profile
  static async getMe(req, res) {
    try {
      // L'utilisateur est déjà disponible dans req.user grâce au middleware d'authentification
      const user = req.user;

      if (!user) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      // Récupérer les informations complètes de l'utilisateur
      const { UserAccount } = req.models;
      const userData = await UserAccount.findById(user.id);

      if (!userData) {
        return notFoundResponse(res, 'User');
      }

      // Supprimer les données sensibles avant l'envoi
      const { password_hash, ...userWithoutPassword } = userData;

      return successResponse(res, userWithoutPassword);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Add a skill to a user
  static async addSkill(req, res) {
    try {
      const { userId, skillId } = req.params;

      // Check if user exists
      const user = await UserAccountModel.findById(userId);
      if (!user) {
        return notFoundResponse(res, "User");
      }

      // Check if skill exists
      const skill = await SkillsListModel.findById(skillId);
      if (!skill) {
        return notFoundResponse(res, "Skill");
      }

      await UserAccountModel.addSkill(userId, skillId);
      const updatedUser = await UserAccountModel.findById(userId);

      // Remove sensitive data from response
      delete updatedUser.password_hash;

      return successResponse(res, updatedUser);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Remove a skill from a user
  static async removeSkill(req, res) {
    try {
      const { userId, skillId } = req.params;

      // Check if user exists
      const user = await UserAccountModel.findById(userId);
      if (!user) {
        return notFoundResponse(res, "User");
      }

      await UserAccountModel.removeSkill(userId, skillId);
      const updatedUser = await UserAccountModel.findById(userId);

      // Remove sensitive data from response
      delete updatedUser.password_hash;

      return successResponse(res, updatedUser);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get all skills for a user
  static async getSkills(req, res) {
    try {
      const { userId } = req.params;

      // Check if user exists
      const user = await UserAccountModel.findById(userId);
      if (!user) {
        return notFoundResponse(res, "User");
      }

      const skills = await UserAccountModel.getSkills(userId);
      return successResponse(res, skills);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = UserAccountController;
