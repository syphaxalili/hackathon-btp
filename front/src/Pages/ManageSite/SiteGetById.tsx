import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "../../config";

type Stakeholder = {
  name: string | "Null";
  tax_number: string | "Null";
  vat_number: string | "Null";
  email: string | "Null";
  address: string | "Null";
  postale_code: string | "Null";
  city: string | "Null";
  country: string   | "Null";
};

type Worker = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type Site = {
  id: number;
  address: string;
  postale_code: string;
  city: string;
  country: string;
  email: string;
  number_phone: string;
  stakeholder: Stakeholder;
  workers: Worker[];
  status_construction: string;
};

// gestion de status_construction
const statusConstructionLabels: { [key: string]: string } = {
  EC: "En cours",
  CL: "Cloturé",
  AN: "Annulé",
};
const SiteGetById = () => {
  const { id } = useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchSite = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/sites/construction-sites/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSite(res.data);
      } catch (err) {
        setError("Erreur lors du chargement du chantier.");
      }
    };

    fetchSite();
  }, [id]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!site) {
    return <CircularProgress />;
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Chantier #{site.id}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "Adresse", value: site.address },
            { label: "Code postal", value: site.postale_code },
            { label: "Ville", value: site.city },
            { label: "Pays", value: site.country },
            { label: "Email", value: site.email },
            { label: "Téléphone", value: site.number_phone },
            {
              label: "Statut de la construction",
              value: statusConstructionLabels[site.status_construction] || "Inconnu",
            },
          ].map((field, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <TextField
                label={field.label}
                value={field.value}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Ouvriers assignés
        </Typography>
        {site.workers.length === 0 ? (
          <Typography>Aucun ouvrier assigné.</Typography>
        ) : (
          site.workers.map((worker) => (
            <Box key={worker.id} mb={1}>
              <Typography>
                {worker.first_name} {worker.last_name} - {worker.email}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Partie prenante
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[
        { label: "Nom", value: site.stakeholder && site.stakeholder.name && site.stakeholder.name !== "Null" && site.stakeholder.tax_number && site.id > 1 ? site.stakeholder.name : "null" },
        { label: "SIRET", value: site.stakeholder && site.stakeholder.tax_number && site.stakeholder.tax_number !== "Null" && site.id > 1 ? site.stakeholder.tax_number : "null" },
        { label: "TVA", value: site.stakeholder && site.stakeholder.vat_number && site.stakeholder.vat_number !== "Null" && site.id > 1 ? site.stakeholder.vat_number : "null" },
        { label: "Email", value: site.stakeholder && site.stakeholder.email && site.stakeholder.email !== "Null" && site.id > 1 ? site.stakeholder.email : "null" },
        { label: "Adresse", value: site.stakeholder && site.stakeholder.address && site.stakeholder.address !== "Null" && site.id > 1 ? site.stakeholder.address : "null" },
        { label: "Code postal", value: site.stakeholder && site.stakeholder.postale_code && site.stakeholder.postale_code !== "Null" && site.id > 1 ? site.stakeholder.postale_code : "null" },
        { label: "Ville", value: site.stakeholder && site.stakeholder.city && site.stakeholder.city !== "Null" && site.id > 1 ? site.stakeholder.city : "null" },
        { label: "Pays", value: site.stakeholder && site.stakeholder.country && site.stakeholder.country !== "Null" && site.id > 1 ? site.stakeholder.country : "null" },
          ].map((field, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <TextField
            label={field.label}
            value={field.value}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default SiteGetById;
