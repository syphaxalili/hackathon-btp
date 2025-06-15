import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import { apiUrl } from "../../../config";

export default function SitesList() {
  const [sites, setSites] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get("token") || "";

  useEffect(() => {
    fetch(`${apiUrl}/sites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setSites)
      .catch(console.error);
  }, []);

  const handleDelete = id => {
    if (!window.confirm("Supprimer ce chantier ?")) return;
    fetch(`${apiUrl}/sites/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setSites(sites.filter(s => s.id !== id));
    });
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Chantiers</Typography>
        <Button variant="contained" onClick={() => navigate("/dashbord/chantier/new")}>
          + Ajouter
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map(site => (
              <TableRow key={site.id} hover>
                <TableCell>{site.id}</TableCell>
                <TableCell>{site.address}</TableCell>
                <TableCell>{site.city}</TableCell>
                <TableCell>{site.status_construction}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/dashbord/chantier/${site.id}`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(site.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
