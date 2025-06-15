import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { Box, Card, CardContent, CardHeader, Typography, CardActionArea, useTheme } from '@mui/material';
import { apiUrl } from '../config';

// Structure de données KPI attendue
// users: total, active, inactive
// sites: total, validated, closed, cancelled
// stakeholders: total

type KpiData = {
  users: { total: number; active: number; inactive: number };
  sites: { total: number; validated: number; closed: number; cancelled: number };
  stakeholders: { total: number };
};

export default function DashboardKpiStyled() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const token = Cookie.get('token') || '';
  const theme = useTheme();

  useEffect(() => {
    fetch(`${apiUrl}/stats/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setKpis)
      .catch(console.error);
  }, [token]);

  if (!kpis) {
    return <Typography>Chargement des KPI…</Typography>;
  }

  // Définition des cartes avec styles, couleurs et commentaires
  const cards = [
    {
      id: 'u_total',
      title: 'Total Utilisateurs',
      value: kpis.users.total,
      color: theme.palette.primary.main,
      comment: 'Nombre total d’utilisateurs inscrits sur la plateforme.'
    },
    {
      id: 'u_active',
      title: 'Utilisateurs Actifs',
      value: kpis.users.active,
      color: theme.palette.success.main,
      comment: 'Utilisateurs ayant interagi au cours des 30 derniers jours.'
    },
    {
      id: 'u_inactive',
      title: 'Utilisateurs Inactifs',
      value: kpis.users.inactive,
      color: theme.palette.warning.main,
      comment: 'Utilisateurs sans connexion récente.'
    },
    {
      id: 's_total',
      title: 'Chantiers Totaux',
      value: kpis.sites.total,
      color: theme.palette.primary.dark,
      comment: 'Nombre de projets en cours ou terminés.'
    },
    {
      id: 's_validated',
      title: 'Chantiers Validés',
      value: kpis.sites.validated,
      color: theme.palette.success.light,
      comment: 'Projets officiellement approuvés.'
    },
    {
      id: 's_closed',
      title: 'Chantiers Clôturés',
      value: kpis.sites.closed,
      color: theme.palette.info.main,
      comment: 'Projets terminés et archivés.'
    },
    {
      id: 's_cancelled',
      title: 'Chantiers Annulés',
      value: kpis.sites.cancelled,
      color: theme.palette.error.main,
      comment: 'Projets interrompus avant achèvement.'
    },
    {
      id: 'sh_total',
      title: 'Total Parties Prenantes',
      value: kpis.stakeholders.total,
      color: theme.palette.secondary.main,
      comment: 'Nombre d’intervenants associés aux projets.'
    }
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 3,
        p: 2
      }}
    >
      {cards.map(card => (
        <Card key={card.id} elevation={selectedCard === card.id ? 8 : 2}>
          <CardActionArea
            onClick={() => setSelectedCard(card.id)}
            sx={{
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              transform: selectedCard === card.id ? 'scale(1.05)' : 'scale(1)',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 6
              }
            }}
          >
            <CardHeader
              title={<Typography variant="h6" sx={{ color: card.color }}>{card.title}</Typography>}
              titleTypographyProps={{ gutterBottom: true }}
            />
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {card.comment}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
