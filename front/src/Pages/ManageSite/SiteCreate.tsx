import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Cookie from "js-cookie";
import { apiUrl } from "../../config";
import { useNavigate } from "react-router-dom";

const SiteCreate = () => {
  const [formData, setFormData] = useState({
    status_construction: "VA", // Brouillon par défaut
    n_worker: "",
    address: "",
    postale_code: "",
    city: "",
    country: "",
    number_phone: "",
    email: "",
    users: [] as number[],
    stakeholderId: "",
  });

  type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = Cookie.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, stakeholdersRes] = await Promise.all([
          axios.get(`${apiUrl}/sites/users/available`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/sites/stakeholders/visible`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAvailableUsers(usersRes.data);
        setStakeholders(stakeholdersRes.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/sites/construction-sites`,
        {
          ...formData,
          users: formData.users,
          stakeholderId: formData.stakeholderId || null,
          n_worker: parseInt(formData.n_worker),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Chantier créé !");
        navigate("/dashbord/chantiers");
      }
    } catch (err) {
      console.error("Erreur création chantier :", err);
      alert("Erreur lors de la création du chantier.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Création d’un chantier
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre d'ouvriers"
          name="n_worker"
          type="number"
          value={formData.n_worker}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Adresse"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Code postal"
          name="postale_code"
          value={formData.postale_code}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Ville"
          name="city"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Pays"
          name="country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Téléphone"
          name="number_phone"
          value={formData.number_phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Select multiple pour users */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-users-label">Ouvriers disponibles</InputLabel>
          <Select
            labelId="select-users-label"
            multiple
            value={formData.users}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                users: e.target.value as number[],
              }))
            }
            input={<OutlinedInput label="Ouvriers disponibles" />}
            renderValue={(selected) =>
              selected
                .map(
                  (id) =>
                    availableUsers.find((u: any) => u.id === id)?.first_name +
                    " " +
                    availableUsers.find((u: any) => u.id === id)?.last_name
                )
                .join(", ")
            }
          >
            {availableUsers.map((user: any) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={formData.users.includes(user.id)} />
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  secondary={user.email}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select simple pour stakeholder */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-stakeholder-label">Partie prenante</InputLabel>
          <Select
            labelId="select-stakeholder-label"
            value={formData.stakeholderId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stakeholderId: e.target.value,
              }))
            }
          >
            {stakeholders.map((s: any) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={3}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Créer le chantier
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SiteCreate;
