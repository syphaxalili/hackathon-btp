const jwt = require("jsonwebtoken");

class AuthMiddleware {
  static authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "dev-secret");
      req.user = decoded; // Injecte les infos dans la requête
      next();
    } catch (err) {
      return res
        .status(403)
        .json({ success: false, message: "Token invalide" });
    }
  }
}

module.exports = AuthMiddleware;
