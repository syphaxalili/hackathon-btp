import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, Box } from "@mui/material";
import { apiUrl } from "../../../config";
import { useAtom } from "jotai";
import { userAtom } from "../Atom/UserAtom";

const WorkersList = () => {
  const [rows, setRows] = useState([]);
  const [user] = useAtom(userAtom); // Assuming you have a userAtom defined in your state management

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/all`, {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          // ajoute un id pour chaque ligne (obligatoire pour DataGrid)
          const formatted = data.data.map((user, index) => ({
            id: index + 1,
            userId: user.id, // caché
            first_name: user.first_name,
            last_name: user.last_name,
            is_actif: user.is_actif,
          }));
          setRows(formatted);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      field: "userId",
      headerName: "ID",
      hide: true,
    },
    {
      field: "first_name",
      headerName: "Prénom",
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Nom",
      flex: 1,
    },
    {
      field: "is_actif",
      headerName: "Statut",
      flex: 1,
      renderCell: (params) => (
        <Typography color={params.value ? "green" : "red"}>
          {params.value ? "Disponible" : "Indisponible"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleView(params.row)}
          >
            Voir plus
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => handleEdit(params.row)}
          >
            Modifier
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            Supprimer
          </Button>
        </Box>
      ),
    },
  ];

  // Exemple de gestion des actions
  const handleView = (row) => {
    console.log("Voir plus :", row);
    // redirige ou ouvre un modal si tu veux
  };

  const handleEdit = (row) => {
    console.log("Modifier :", row);
    // navigue ou ouvre un formulaire
  };

  const handleDelete = (row) => {
    console.log("Supprimer :", row);
    // appelle l’API pour suppression
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Liste des utilisateurs
      </Typography>
      {user.user_type === "AD" && (
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.assign("/dashbords/invite/user")}
          >
            Inviter un utilisateur
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

export default WorkersList;
