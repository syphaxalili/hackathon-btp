import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";
import { useAtom } from "jotai";
import { userAtom } from "../../components/Atom/UserAtom";
import Cookies from "js-cookie";

const StakeHolderUpdateById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
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
  const [message, setMessage] = useState<{
    type: AlertSeverity | "";
    text: string;
  }>({ type: "", text: "" });

  useEffect(() => {
    const fetchStakeholder = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${apiUrl}/stakeholders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success && result.data) {
          const data = result.data;
          setFormData({
            name: data.name || "",
            tax_number: data.tax_number || "",
            vat_number: data.vat_number || "",
            address: data.address || "",
            postale_code: data.postale_code || "",
            city: data.city || "",
            country: data.country || "",
            number_phone: data.number_phone || "",
            email: data.email || "",
          });
        } else {
          setMessage({
            type: "error",
            text: "Échec du chargement des données.",
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Erreur réseau." });
      }
    };

    fetchStakeholder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(`${apiUrl}/stakeholders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Modifications enregistrées." });
      } else {
        setMessage({ type: "error", text: result.error || "Erreur inconnue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur réseau." });
    }
  };

  const handleDelete = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(`${apiUrl}/stakeholders/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        navigate("/dashbord/stakeholder");
      } else {
        const result = await response.json();
        setMessage({
          type: "error",
          text: result.error || "Suppression échouée.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression." });
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Modifier le sous-traitant
      </Typography>
      {message.text && message.type && (
        <Alert
          severity={message.type as "error" | "info" | "success" | "warning"}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nom de l'entreprise"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />

      <TextField
        fullWidth
        label="Numéro de TVA"
        name="vat_number"
        value={formData.vat_number}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />

      <TextField
        fullWidth
        label="Numéro fiscal"
        name="tax_number"
        value={formData.tax_number}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />

      <TextField
        fullWidth
        label="Adresse"
        name="address"
        value={formData.address}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />
      <TextField
        fullWidth
        label="poste code"
        name="postale_code"
        value={formData.postale_code}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />
      <TextField
        fullWidth
        label="Ville"
        name="city"
        value={formData.city}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />
      <TextField
        fullWidth
        label="Pays"
        name="country"
        value={formData.country}
        onChange={handleChange}
        margin="normal"
        disabled={user.user_type !== "AD"}
        required
      />

      {user.user_type === "AD" && (
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Enregistrer
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Supprimer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default StakeHolderUpdateById;
