import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { apiUrl } from "../../config";
import { useAtom } from "jotai";
import { userAtom } from "../../components/Atom/UserAtom";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";

const STATUS_LABELS = {
  VA: "Validé",
  CL: "Clôturé",
  AN: "Annulé",
};

const SiteGetAll = () => {
  const [rows, setRows] = useState([]);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const token = Cookie.get("token");

  const [openDialog, setOpenDialog] = useState(false);
  type SiteRow = {
    id: number;
    siteId: number;
    status: string;
    workers: number;
    address: string;
    city: string;
    country: string;
  };
  const [selectedSite, setSelectedSite] = useState<SiteRow | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchSites = async () => {
    try {
      const response = await fetch(`${apiUrl}/sites/construction-sites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const formatted = data.data.map((site, index) => ({
          id: index + 1,
          siteId: site.id,
          status: site.status_construction,
          workers: site.n_worker,
          address: site.address,
          city: site.city,
          country: site.country,
        }));
        setRows(formatted);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des sites :", error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [token]);

  const handleOpenDialog = (row) => {
    setSelectedSite(row);
    setNewStatus(""); // vide par défaut
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSite(null);
    setNewStatus("");
  };

  const handleStatusChange = async () => {
    if (!selectedSite || !newStatus || newStatus === selectedSite.status) {
      return;
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/sites/construction-sites/statut/${selectedSite.siteId}`,
        { status_construction: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        handleCloseDialog();
        fetchSites();
      }
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
    }
  };

  const columns = [
    {
      field: "siteId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Statut",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={STATUS_LABELS[params.value]}
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "workers",
      headerName: "Ouvriers",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Adresse",
      flex: 1.5,
    },
    {
      field: "city",
      headerName: "Ville",
      flex: 1,
    },
    {
      field: "country",
      headerName: "Pays",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => {
        const isEditable =
          (params.row.status === "BR" &&
            ["AD", "CDC"].includes(user.user_type)) ||
          (params.row.status === "VA" && user.user_type === "AD");

        return (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/dashboard/sites/${params.row.siteId}`)}
            >
              Voir plus
            </Button>
            {isEditable && (
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => handleOpenDialog(params.row)}
              >
                Modifier Statut
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  const statusOptions = Object.keys(STATUS_LABELS).filter(
    (code) => code !== selectedSite?.status
  );

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Liste des Chantiers
      </Typography>

      {(user.user_type === "AD" || user.user_type === "CDC") && (
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.assign("/dashbord/site/new")}
          >
            Créer un chantier
          </Button>
        </Box>
      )}

      <Box style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 7, page: 0 },
            },
          }}
          pageSizeOptions={[7]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* ✅ Fenêtre de modification de statut */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Modifier le statut du chantier</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              value={newStatus}
              label="Nouveau statut"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map((code) => (
                <MenuItem key={code} value={code}>
                  {STATUS_LABELS[code]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleStatusChange}
            disabled={!newStatus || newStatus === selectedSite?.status}
            variant="contained"
            color="primary"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SiteGetAll;
