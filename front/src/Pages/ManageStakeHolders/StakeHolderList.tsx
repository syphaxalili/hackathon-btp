import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, Box } from "@mui/material";
import { apiUrl } from "../../config";
import { useAtom } from "jotai";
import { userAtom } from "../../Atom/UserAtom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const StakeHolderList = () => {
  const [rows, setRows] = useState([]);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        const response = await fetch(`${apiUrl}/stakeholders/all`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const formatted = data.data.map((sh: any, index: number) => ({
            id: index + 1,
            stakeholderId: sh.id, // caché
            name: sh.name,
            tax_number: sh.tax_number,
            address: sh.address || "Non renseignée",
          }));

          setRows(formatted);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sous-traitants :", error);
      }
    };

    fetchStakeholders();
  }, []);

  const columns = [
    {
      field: "stakeholderId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Nom",
      flex: 1.5,
    },
    {
      field: "tax_number",
      headerName: "Numéro Fiscal",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Adresse",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
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

  const handleView = (row) => {
    navigate(`/dashbord/stakeholder/${row.stakeholderId}`);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Liste des sous-traitants
      </Typography>

      {user.user_type === "AD" && (
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/dashbord/stakeholder/new")}
          >
            Créer un nouveau sous-traitant
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

export default StakeHolderList;
