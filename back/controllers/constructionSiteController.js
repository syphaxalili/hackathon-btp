const { successResponse, errorResponse, notFoundResponse } = require("./utils");
const { Op } = require("sequelize");

class ConstructionSiteController {
  static async getAllSites(req, res) {
    try {
      const { ConstructionSite } = req.models;
      const sites = await ConstructionSite.findAll({
        order: [["id"]],
      });

      return successResponse(res, sites);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
  static async getConstructionSiteById(req, res) {
    const { ConstructionSite, StakeHolder, UserAccount } = req.models;
    const siteId = req.params.id;

    try {
      const site = await ConstructionSite.findByPk(siteId, {
        include: [
          {
            model: StakeHolder,
            as: "stakeholder",
          },
          {
            model: UserAccount,
            as: "workers",
            through: { attributes: [] },
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      });

      if (!site) {
        return res.status(404).json({ error: "Chantier non trouvé" });
      }

      return res.status(200).json(site);
    } catch (err) {
      console.error("Erreur lors de la récupération du chantier :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getAvailableUsers(req, res) {
    const { UserAccount, StakeHolder } = req.models;
    try {
      const users = await UserAccount.findAll({
        where: {
          is_actif: true,
          is_visible: true,
        },
        attributes: ["id", "first_name", "last_name", "email"],
      });

      return res.status(200).json(users);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getVisibleStakeholders(req, res) {
    const { StakeHolder } = req.models;
    try {
      const stakeholders = await StakeHolder.findAll({
        where: { is_actif: true },
        attributes: ["id", "name"],
      });

      return res.status(200).json(stakeholders);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des parties prenantes :",
        err
      );
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async createConstructionSite(req, res) {
    const { ConstructionSite, UserAccount } = req.models;
    const {
      status_construction,
      n_worker,
      users = [],
      stakeholderId = null,
      ...siteData
    } = req.body;

    const transaction = await ConstructionSite.sequelize.transaction();

    try {
      const site = await ConstructionSite.create(
        {
          status_construction: status_construction,
          n_worker: n_worker,
          ...siteData,
          st_Id: stakeholderId,
        },
        { transaction }
      );

      if (users.length > 0) {
        await site.addWorkers(users, { transaction });

        await UserAccount.update(
          { is_actif: false },
          {
            where: { id: { [Op.in]: users } },
            transaction,
          }
        );
      }

      await transaction.commit();

      return res
        .status(201)
        .json({ message: "Chantier créé avec succès", siteId: site.id });
    } catch (err) {
      console.error("Erreur lors de la création du chantier :", err);
      await transaction.rollback();
      return res
        .status(500)
        .json({ error: "Erreur lors de la création du chantier" });
    }
  }

  static async updateStatus(req, res) {
    const { ConstructionSite, UserAccount, StakeHolder } = req.models;
    const siteId = req.params.id;
    const { status_construction } = req.body;

    const sequelize = ConstructionSite.sequelize;

    try {
      await sequelize.transaction(async (t) => {
        const site = await ConstructionSite.findByPk(siteId, {
          include: [{ model: UserAccount, as: "workers" }],
          transaction: t,
        });
        if (!site) {
          return notFoundResponse(res, "Chantier non trouvé");
        }

        site.status_construction = status_construction;
        await site.save({ transaction: t });

        const userIds = site.workers.map((user) => user.id);

        if (userIds.length > 0) {
          await UserAccount.update(
            { is_actif: true },
            {
              where: { id: userIds },
              transaction: t,
            }
          );
        }
      });

      return successResponse(res, {
        message: "Statut mis à jour et utilisateurs activés.",
      });
    } catch (error) {
      console.error("Erreur updateStatus:", error);
      return errorResponse(res, error.message);
    }
  }
}

module.exports = ConstructionSiteController;
