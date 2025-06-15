import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { apiUrl } from "../../config";

const StakeHolderCreateNew = () => {
  const [formData, setFormData] = useState({
    name: "",
    tax_number: "",
    vat_number: "",
    address: "",
    postale_code: "",
    city: "",
    country: "",
    number_phone: "",
    email: "",
  });

  type AlertSeverity = "error" | "info" | "success" | "warning";
  const [message, setMessage] = useState<{ type?: AlertSeverity; text: string }>(
    {
      type: undefined,
      text: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    const { name, tax_number, vat_number, address } = formData;
    if (!name || !tax_number || !vat_number || !address) {
      setMessage({
        type: "warning",
        text: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      setMessage({
        type: "error",
        text: "Aucun token trouvé dans les cookies.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/stakeholders/create`, {
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
          text: "Sous-traitant enregistré avec succès !",
        });
        setFormData({
          name: "",
          tax_number: "",
          vat_number: "",
          address: "",
          postale_code: "",
          city: "",
          country: "",
          number_phone: "",
          email: "",
        });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur inconnue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l’envoi." });
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Créer un nouveau sous-traitant
      </Typography>

      {message.text && message.type && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          label="Nom"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          label="Numéro fiscal"
          name="tax_number"
          value={formData.tax_number}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          label="Numéro TVA"
          name="vat_number"
          value={formData.vat_number}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          label="Adresse"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Code postal"
          name="postale_code"
          value={formData.postale_code}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Ville"
          name="city"
          value={formData.city}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Pays"
          name="country"
          value={formData.country}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Téléphone"
          name="number_phone"
          value={formData.number_phone}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Enregistrer
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default StakeHolderCreateNew;
