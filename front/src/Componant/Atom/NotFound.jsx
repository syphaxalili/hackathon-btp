import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const NotFoundWrapper = styled(Paper)`
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

const GoHomeButton = styled(Button)`
  margin-top: 2rem;
  font-weight: bold;
  padding: 0.75rem 2.5rem;
  width: 100%;
  animation: ${bounce} 2s infinite;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #1565c0;
    box-shadow: 0 0 20px #2196f3;
  }
`;

export default function NotFound() {
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
      <NotFoundWrapper elevation={6}>
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold", mb: 2, color: "#191015" }}
        >
          Oops!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, color: "#191015" }}>
          Ce lien est inexistant ou a été supprimé.
        </Typography>
        <GoHomeButton onClick={() => navigate("/")}>
          Retour à l'accueil
        </GoHomeButton>
      </NotFoundWrapper>
    </Box>
  );
}
