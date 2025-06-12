import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const StyledPaper = styled(Paper)`
  animation: ${fadeIn} 1s ease-out forwards;
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  margin: auto;
  background: linear-gradient(135deg, #e0f7fa, #fff);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  color: white;
`;

const BackHomeButton = styled(Button)`
  margin-top: 2rem;
  font-weight: bold;
  padding: 0.75rem 2.5rem;
  width: 100%;
  animation: ${shake} 1s infinite ease-in-out;
  background-color: #d32f2f;
  color: white;
  &:hover {
    background-color: #b71c1c;
    box-shadow: 0 0 20px #ff1744;
  }
`;

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right,#0f0c29,#302b63,#24243e)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <StyledPaper elevation={6}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mb: 2, color: "#f44336" }}
        >
          Accès refusé
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: "#191015" }}>
          Vous n’avez pas l’autorisation pour accéder à cette page.
        </Typography>
        <BackHomeButton onClick={() => navigate("/")}>
          Retour à l'accueil
        </BackHomeButton>
      </StyledPaper>
    </Box>
  );
}
