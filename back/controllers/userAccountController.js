const { successResponse, errorResponse, notFoundResponse } = require("./utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const EmailService = require("../middlewares/sendEMail");

class UserAccountController {
  static async create(req, res) {
    try {
      const { UserAccount } = req.models;

      const { email, password, user_type, firstname, lastname, ...userData } =
        req.body;

      if (!email || !password || !user_type || !firstname || !lastname) {
        return errorResponse(
          res,
          "Email, password, user_type, firstname, and lastname are required",
          400
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserAccount.create({
        email: email,
        password: hashedPassword,
        user_type: user_type,
        first_name: firstname,
        last_name: lastname,
        ...userData,
      });

      const userJson = newUser.toJSON();
      delete userJson.password;

      delete newUser.password_hash;

      return successResponse(res, newUser, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  static async inviteUser(req, res) {
    try {
      const { UserAccount } = req.models;
      const { email, user_type, firstname, lastname, ...userData } = req.body;

      if (!email || !user_type || !firstname || !lastname) {
        return errorResponse(
          res,
          "Email, user_type, firstname, and lastname are required",
          400
        );
      }

      // Vérifie si l'utilisateur existe déjà
      const existingUser = await UserAccount.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, "User already exists with this email", 409);
      }

      // Génère un mot de passe aléatoire
      const randomPassword = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Crée le nouvel utilisateur
      const newUser = await UserAccount.create({
        email: email,
        password: hashedPassword,
        user_type: user_type,
        first_name: firstname,
        last_name: lastname,
        ...userData,
      });

      // Email HTML à envoyer
      const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Bienvenue ${firstname} ${lastname},</h2>
        <p>Un compte a été créé pour vous.</p>
        <p><strong>Votre email :</strong> ${email}</p>
        <p><strong>Votre mot de passe :</strong> ${randomPassword}</p>
        <p>Merci et bonne connexion !</p>
      </div>
    `;

      // Envoi de l'email
      await EmailService.sendEmail(
        email,
        "Votre compte a été créé",
        htmlContent
      );

      const userJson = newUser.toJSON();
      delete userJson.password;

      return successResponse(res, userJson, 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  static async login(req, res) {
    const { UserAccount } = req.models;

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, "Email and password are required", 400);
      }

      const user = await UserAccount.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, "Invalid email or password", 401);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse(res, "Invalid email or password", 401);
      }

      const payload = {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
      };
      const token = jwt.sign(payload, "dev-secret", {
        expiresIn: "1d",
      });

      const userJson = user.toJSON();
      delete userJson.password;

      res.cookie("token", token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
        samsite: "lax",
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

      // Convertir en objets simples et filtrer les champs utiles
      const filteredUsers = users.map((user) => {
        const plainUser = user.get({ plain: true }); // IMPORTANT
        return {
          email: plainUser.email,
          first_name: plainUser.first_name,
          last_name: plainUser.last_name,
          user_type: plainUser.user_type,
          is_actif: plainUser.is_actif,
        };
      });

      return successResponse(res, filteredUsers);
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
      // Vérifie que l'utilisateur a été injecté par le middleware d'auth
      const user = req.user;

      if (!user || !user.id) {
        return errorResponse(res, "User not authenticated", 401);
      }

      // Récupère l'utilisateur dans la base de données
      const userData = await req.models.UserAccount.findByPk(user.id);

      if (!userData) {
        return notFoundResponse(res, "User");
      }

      // Supprime les champs sensibles
      const { password_hash, ...userWithoutPassword } = userData.get({
        plain: true,
      });

      // Renvoie les données utilisateur dans un objet "user"
      return successResponse(res, { user: userWithoutPassword });
    } catch (error) {
      return errorResponse(res, error.message || "Server error");
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
