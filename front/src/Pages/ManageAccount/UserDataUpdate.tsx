import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useAtom } from "jotai";
import { userAtom } from "../../components/Atom/UserAtom";
import { apiUrl } from "../../config";

const UpdateUserData = () => {
  const [user] = useAtom(userAtom);

  const [formData, setFormData] = useState({
    firstname: user.first_name || "",
    lastname: user.last_name || "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      setMessage({ type: "error", text: "Token d’authentification manquant." });
      return;
    }

    try {
      const bodyToSend: {
        first_name: string;
        last_name: string;
        password?: string;
      } = {
        first_name: formData.firstname,
        last_name: formData.lastname,
      };

      if (formData.password) {
        bodyToSend.password = formData.password;
      }

      const response = await fetch(`${apiUrl}/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Données mises à jour avec succès.",
        });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur inconnue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue." });
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Mettre à jour vos informations
      </Typography>

      {message.text && (
        <Alert
          severity={
            message.type === "error" ||
            message.type === "success" ||
            message.type === "info" ||
            message.type === "warning"
              ? message.type
              : "info"
          }
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
          label="Nouveau mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Confirmez le mot de passe"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          error={
            !!formData.confirmPassword &&
            formData.password !== formData.confirmPassword
          }
          helperText={
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
              ? "Les mots de passe ne correspondent pas."
              : ""
          }
        />

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sauvegarder les modifications
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateUserData;
