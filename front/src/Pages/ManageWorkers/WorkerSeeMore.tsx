import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { apiUrl } from "../../config";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { userAtom } from "../../Atom/UserAtom";

type Worker = {
  first_name: string;
  last_name: string;
  email: string;
  is_actif: boolean;
  user_type: string;
  createdAt: string;
};

const WorkerSeeMore = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/worker/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setWorker(data.data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    };

    if (token) fetchWorker();
  }, [id, token]);

  const handleAddSkill = () => {
    console.log("Compétence ajoutée :", newSkill);
    setNewSkill("");
  };

  const handleDeactivate = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/delete/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        navigate("/dashbord/ouvriers");
      }
    } catch (err) {
      console.error("Erreur lors de la désactivation :", err);
    }
  };

  if (!worker) return <Typography>Chargement...</Typography>;

  return (
    <Box display="flex" gap={2} p={2}>
      <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Informations de l'utilisateur
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>
          <strong>Prénom :</strong> {worker.first_name}
        </Typography>
        <Typography>
          <strong>Nom :</strong> {worker.last_name}
        </Typography>
        <Typography>
          <strong>Email :</strong> {worker.email}
        </Typography>
        <Typography>
          <strong>Statut :</strong>{" "}
          <span style={{ color: worker.is_actif ? "green" : "red" }}>
            {worker.is_actif ? "Actif" : "Inactif"}
          </span>
        </Typography>
        <Typography>
          <strong>Type :</strong> {worker.user_type}
        </Typography>
        <Typography>
          <strong>Créé le :</strong>{" "}
          {new Date(worker.createdAt).toLocaleDateString("fr-FR")}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter une compétence
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          label="Compétence"
          fullWidth
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddSkill}
        >
          Ajouter
        </Button>
      </Paper>
      {user.user_type === "AD" && (
        <Box
          position="fixed"
          bottom={16}
          left={16}
          right={16}
          display="flex"
          justifyContent="center"
        >
          <Button variant="outlined" color="error" onClick={handleDeactivate}>
            Rendre inactif l'utilisateur
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WorkerSeeMore;
