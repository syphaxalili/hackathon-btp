import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper
} from "@mui/material";
import Cookies from "js-cookie";
import { apiUrl } from "../../../config";

const defaultForm = {
  address: "",
  postale_code: 0,
  city: "",
  country: "",
  status_construction: "BR",
  n_worker: 0,
  number_phone: "",
  email: "",
  st_Id: 0
};

export default function SiteEdit() {
  const { id } = useParams();
  const isNew = id === "new";
  const [form, setForm] = useState(defaultForm);
  const navigate = useNavigate();
  const token = Cookies.get("token") || "";

  useEffect(() => {
    if (!isNew) {
      fetch(`${apiUrl}/sites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(console.error);
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === "postale_code" ||
        name === "n_worker" ||
        name === "st_Id"
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = isNew ? "POST" : "PUT";
    const url = isNew
      ? `${apiUrl}/sites`
      : `${apiUrl}/sites/${id}`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    }).then(() => navigate("/dashbord/chantiers"));
  };

  return (
    <Box p={2} maxWidth={600} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          {isNew ? "Ajouter un chantier" : `Éditer chantier #${id}`}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            label="Adresse"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Code postal"
            name="postale_code"
            type="number"
            value={form.postale_code}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Ville"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Pays"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Statut"
            name="status_construction"
            value={form.status_construction}
            onChange={handleChange}
          >
            {[
              { value: "BR", label: "Brouillon" },
              { value: "VA", label: "Validé" },
              { value: "EC", label: "En cours" },
              { value: "CL", label: "Clôturé" },
              { value: "AN", label: "Annulé" }
            ].map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="Nb ouvriers"
            name="n_worker"
            type="number"
            value={form.n_worker}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Téléphone"
            name="number_phone"
            value={form.number_phone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="ID StakeHolder"
            name="st_Id"
            type="number"
            value={form.st_Id}
            onChange={handleChange}
          />

          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate("/dashbord/chantiers")}>
              Annuler
            </Button>
            <Button variant="contained" type="submit">
              {isNew ? "Créer" : "Mettre à jour"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
