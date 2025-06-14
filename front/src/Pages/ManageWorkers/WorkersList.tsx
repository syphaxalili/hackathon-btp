import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, Box } from "@mui/material";
import { apiUrl } from "../../config";
import { useAtom } from "jotai";
import { userAtom } from "../../components/Atom/UserAtom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const WorkersList = () => {
  const [rows, setRows] = useState([]);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const token = Cookies.get("token"); // Assurez-vous que le token est récupéré correctement

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/all`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assurez-vous que le token est correctement passé
          },
        });
        const data = await response.json();

        if (data.success) {
          // ajoute un id pour chaque ligne (obligatoire pour DataGrid)
          const formatted = data.data.map((user: any, index: number) => ({
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
      flex: 0.5,
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Typography color={params.value ? "green" : "red"}>
            {params.value ? "Disponible" : "Indisponible"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleView(params.row)}
          >
            Voir plus
          </Button>
        </Box>
      ),
    },
  ];

  // Exemple de gestion des actions
  const handleView = (row) => {
    navigate(`/dashbord/worker/${row.userId}`); // Passe l'ID dans l'URL
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
            onClick={() => window.location.assign("/dashbord/invite/user")}
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
