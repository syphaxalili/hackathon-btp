import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { apiUrl } from '../config';
import Cookies from "js-cookie";

interface Category {
  id: number;
  name: string;
  skills: Skill[];
}

interface Skill {
  id: number;
  name: string;
  description: string;
  CategoryId: number;
}

const SkillsManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openSkillDialog, setOpenSkillDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const token = Cookies.get("token");

  // Fonction utilitaire pour les appels API
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Ne pas ajouter l'en-tête d'autorisation si le token n'est pas défini
    // Cela permet aux routes publiques de fonctionner
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    // Pour les réponses 204 (No Content), ne pas essayer de parser le JSON
    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, skillsResponse] = await Promise.all([
          apiCall('/categories'),
          apiCall('/skills')
        ]);
        
        setCategories(categoriesResponse.data || []);
        setSkills(skillsResponse.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // CRUD Catégories
  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      const response = await apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: categoryData.name }),
      });
      
      const newCategory = response.data;
      setCategories([...categories, { ...newCategory, skills: [] }]);
      setSuccess('Catégorie créée avec succès');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Category>) => {
    try {
      const response = await apiCall(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: categoryData.name }),
      });
      
      const updatedCategory = response.data;
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, ...updatedCategory } : cat
      ));
      setSuccess('Catégorie mise à jour avec succès');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await apiCall(`/categories/${id}`, {
        method: 'DELETE',
      });
      
      setCategories(categories.filter(cat => cat.id !== id));
      // Supprimer aussi les compétences liées à cette catégorie
      setSkills(skills.filter(skill => skill.CategoryId !== id));
      setSuccess('Catégorie supprimée avec succès');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  // CRUD Compétences
  const createSkill = async (skillData: Partial<Skill>) => {
    try {
      const response = await apiCall('/skills', {
        method: 'POST',
        body: JSON.stringify({ 
          name: skillData.name,
          description: skillData.description,
          CategoryId: skillData.CategoryId 
        }),
      });
      
      const newSkill = response.data;
      setSkills([...skills, newSkill]);
      setSuccess('Compétence créée avec succès');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const updateSkill = async (id: number, skillData: Partial<Skill>) => {
    try {
      const response = await apiCall(`/skills/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          name: skillData.name,
          description: skillData.description,
          CategoryId: skillData.CategoryId 
        }),
      });
      
      const updatedSkill = response.data;
      setSkills(skills.map(skill => 
        skill.id === id ? updatedSkill : skill
      ));
      setSuccess('Compétence mise à jour avec succès');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await apiCall(`/skills/${id}`, {
        method: 'DELETE',
      });
      
      setSkills(skills.filter(skill => skill.id !== id));
      setSuccess('Compétence supprimée avec succès');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  // Handlers pour les dialogues
  const handleCategorySubmit = async () => {
    if (!currentCategory.name?.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    setLoading(true);
    try {
      if (editing && currentCategory.id) {
        await updateCategory(currentCategory.id, currentCategory);
      } else {
        await createCategory(currentCategory);
      }
      setOpenCategoryDialog(false);
      setCurrentCategory({});
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async () => {
    if (!currentSkill.name?.trim()) {
      setError('Le nom de la compétence est requis');
      return;
    }

    setLoading(true);
    try {
      if (editing && currentSkill.id) {
        await updateSkill(currentSkill.id, currentSkill);
      } else {
        await createSkill(currentSkill);
      }
      setOpenSkillDialog(false);
      setCurrentSkill({});
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Toutes les compétences associées seront également supprimées.')) {
      setLoading(true);
      try {
        await deleteCategory(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      setLoading(true);
      try {
        await deleteSkill(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setEditing(true);
    setOpenCategoryDialog(true);
  };

  const handleAddSkill = (CategoryId: number) => {
    setCurrentSkill({ CategoryId });
    setEditing(false);
    setOpenSkillDialog(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setCurrentSkill(skill);
    setEditing(true);
    setOpenSkillDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Compétences
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={() => {
            setCurrentCategory({});
            setEditing(false);
            setOpenCategoryDialog(true);
          }}
          disabled={loading}
        >
          Ajouter une catégorie
        </Button>
      </Box>

      {categories.map((category) => (
        <Box key={category.id} mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{category.name}</Typography>
            <Box>
              <IconButton 
                onClick={() => handleEditCategory(category)} 
                color="primary"
                disabled={loading}
              >
                <Edit />
              </IconButton>
              <IconButton 
                onClick={() => handleDeleteCategory(category.id)} 
                color="error"
                disabled={loading}
              >
                <Delete />
              </IconButton>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<Add />}
                onClick={() => handleAddSkill(category.id)}
                sx={{ ml: 1 }}
                disabled={loading}
              >
                Ajouter une compétence
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills
                  .filter(skill => skill.CategoryId === category.id)
                  .map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>{skill.name}</TableCell>
                      <TableCell>{skill.description}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleEditSkill(skill)} 
                          size="small"
                          disabled={loading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteSkill(skill.id)} 
                          size="small" 
                          color="error"
                          disabled={loading}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Dialogue pour ajouter/modifier une catégorie */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '400px', pt: 2 }}>
            <TextField
              label="Nom de la catégorie"
              value={currentCategory.name || ''}
              onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleCategorySubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {editing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue pour ajouter/modifier une compétence */}
      <Dialog open={openSkillDialog} onClose={() => setOpenSkillDialog(false)}>
        <DialogTitle>{editing ? 'Modifier la compétence' : 'Nouvelle compétence'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '400px', pt: 2 }}>
            <TextField
              label="Nom de la compétence"
              value={currentSkill.name || ''}
              onChange={(e) => setCurrentSkill({...currentSkill, name: e.target.value})}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Description"
              value={currentSkill.description || ''}
              onChange={(e) => setCurrentSkill({...currentSkill, description: e.target.value})}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkillDialog(false)} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSkillSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {editing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SkillsManagement;