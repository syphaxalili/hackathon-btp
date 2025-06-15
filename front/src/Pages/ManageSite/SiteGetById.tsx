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
  name: string;
  tax_number: string;
  vat_number: string;
  email: string;
  address: string;
  postale_code: string;
  city: string;
  country: string;
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
            { label: "Nom", value: site.stakeholder.name },
            { label: "SIRET", value: site.stakeholder.tax_number },
            { label: "TVA", value: site.stakeholder.vat_number },
            { label: "Email", value: site.stakeholder.email },
            { label: "Adresse", value: site.stakeholder.address },
            { label: "Code postal", value: site.stakeholder.postale_code },
            { label: "Ville", value: site.stakeholder.city },
            { label: "Pays", value: site.stakeholder.country },
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
