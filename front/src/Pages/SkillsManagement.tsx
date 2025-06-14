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
  IconButton
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
  const token = Cookies.get("token"); // Assurez-vous que le token est récupéré correctement

  // Charger les données initiales
  useEffect(() => {
    const fetchCategories = async () => {
      await fetch(`${apiUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).then(res => res.json()).then(({data}) => {
        console.log(`Categories :`,data);
        setCategories(data);
      });
    }
    const fetchSkills = async () => {
      await fetch(`${apiUrl}/skills`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).then(res => res.json()).then(({data}) => {
        console.log(`Skills :`,data);
        setSkills(data);
      });
    }
    fetchCategories();
    fetchSkills();
  }, []);

  const handleCategorySubmit = () => {
    // Ici, vous devrez appeler votre API pour créer/mettre à jour une catégorie
    if (editing && currentCategory.id) {
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id ? { ...cat, ...currentCategory } as Category : cat
      ));
    } else {
      const newCategory = {
        ...currentCategory,
        id: categories.length + 1,
        skills: []
      } as Category;
      setCategories([...categories, newCategory]);
    }
    setOpenCategoryDialog(false);
  };

  const handleSkillSubmit = () => {
    // Ici, vous devrez appeler votre API pour créer/mettre à jour une compétence
    if (editing && currentSkill.id) {
      setSkills(skills.map(skill => 
        skill.id === currentSkill.id ? { ...skill, ...currentSkill } as Skill : skill
      ));
    } else {
      const newSkill = {
        ...currentSkill,
        id: skills.length + 1,
      } as Skill;
      setSkills([...skills, newSkill]);
    }
    setOpenSkillDialog(false);
  };

  const handleDeleteCategory = (id: number) => {
    // Ici, vous devrez appeler votre API pour supprimer une catégorie
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleDeleteSkill = (id: number) => {
    // Ici, vous devrez appeler votre API pour supprimer une compétence
    setSkills(skills.filter(skill => skill.id !== id));
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
        >
          Ajouter une catégorie
        </Button>
      </Box>

      {categories.map((category) => (
        <Box key={category.id} mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{category.name}</Typography>
            <Box>
              <IconButton onClick={() => handleEditCategory(category)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteCategory(category.id)} color="error">
                <Delete />
              </IconButton>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<Add />}
                onClick={() => handleAddSkill(category.id)}
                sx={{ ml: 1 }}
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
                        <IconButton onClick={() => handleEditSkill(skill)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteSkill(skill.id)} size="small" color="error">
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Annuler</Button>
          <Button onClick={handleCategorySubmit} variant="contained" color="primary">
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
            />
            <TextField
              label="Description"
              value={currentSkill.description || ''}
              onChange={(e) => setCurrentSkill({...currentSkill, description: e.target.value})}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkillDialog(false)}>Annuler</Button>
          <Button onClick={handleSkillSubmit} variant="contained" color="primary">
            {editing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SkillsManagement;
