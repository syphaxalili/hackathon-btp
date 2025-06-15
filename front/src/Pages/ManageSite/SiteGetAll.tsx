import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, Box, Chip, Stack } from "@mui/material";
import { apiUrl } from "../../config";
import { useAtom } from "jotai";
import { userAtom } from "../../components/Atom/UserAtom";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

const STATUS_LABELS = {
  BR: "Brouillon",
  VA: "Validé",
  EC: "En cours",
  CL: "Clôturé",
  AN: "Annulé",
};

const SiteGetAll = () => {
  const [rows, setRows] = useState([]);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const token = Cookie.get("token");

  useEffect(() => {
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

    fetchSites();
  }, [token]);

  const handleAction = (row) => {
    if (row.status === "BR" && ["AD", "CDC"].includes(user.user_type)) {
      // Passer de BR à VA
      console.log("Valider le chantier:", row.siteId);
    } else if (row.status === "VA") {
      // Passer de VA à CL ou AN
      console.log("Clôturer ou annuler le chantier:", row.siteId);
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
          params.row.status === "VA";

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
                onClick={() => handleAction(params.row)}
              >
                Modifier Statut
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

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
    </Box>
  );
};

export default SiteGetAll;
