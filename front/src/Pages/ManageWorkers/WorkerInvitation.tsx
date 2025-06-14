import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { apiUrl } from "../../config";

const WorkerInvitation = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    user_type: "OV",
  });

  type AlertSeverity = "error" | "info" | "success" | "warning" | "";
  const [message, setMessage] = useState<{ type: AlertSeverity; text: string }>(
    { type: "", text: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getTokenFromCookie();
    if (!token) {
      setMessage({
        type: "error",
        text: "Aucun token trouvé dans les cookies.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Utilisateur invité avec succès !",
        });
        setFormData({
          email: "",
          firstname: "",
          lastname: "",
          user_type: "OV",
        });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur inconnue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l’envoi." });
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Inviter un utilisateur
      </Typography>
      {message.text && message.type && (
        <Alert
          severity={message.type as "error" | "info" | "success" | "warning"}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Adresse email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Prénom"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nom"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          select
          label="Type d'utilisateur"
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="AD">Administrateur</MenuItem>
          <MenuItem value="OV">Ouvrier</MenuItem>
          <MenuItem value="CDC">Chef de chantier</MenuItem>
        </TextField>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Envoyer l'invitation
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default WorkerInvitation;
