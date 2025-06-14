// middlewares/sendEMail.js

require("dotenv").config();
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // false pour TLS (port 587)
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });
  }

  /**
   * Envoie un e-mail en HTML via Brevo
   * @param {string} to Email du destinataire
   * @param {string} subject Sujet de l’email
   * @param {string} html Contenu HTML de l’email
   * @returns {Promise}
   */
  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Mon App" <${process.env.EMAIL_HOST_USER}>`,
        to,
        subject,
        html,
      });
      console.log("Email envoyé: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Erreur d'envoi d'email :", error);
      throw new Error("Erreur lors de l'envoi de l'email.");
    }
  }
}

module.exports = new EmailService();
