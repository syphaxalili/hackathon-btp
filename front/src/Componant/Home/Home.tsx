// src/pages/Home.jsx
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedPaper = styled(Paper)`
  animation: ${fadeIn} 1s ease forwards;
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  margin: auto;
  background: linear-gradient(135deg, #e0f7fa, #fff);
  border-radius: 16px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
`;

const ConnectButton = styled(Button)`
  margin-top: 2rem;
  font-weight: bold;
  padding: 0.75rem 2rem;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #1565c0;
  }
`;

export default function Home() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right,rgb(4, 34, 58),rgb(20, 31, 34))",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <AnimatedPaper elevation={6}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            color: "#0d47a1",
            opacity: 0,
            animation: "fadeInTitle 1s 1s forwards",
          }}
        >
          EP plateforme intranet BTP
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            mb: 3,
            color: "#333",
            opacity: 0,
            animation: "fadeInSubtitle 1s 2s forwards",
          }}
        >
          La gestion de notre activitée BTP intuitive et rapide.
        </Typography>
        <ConnectButton
          variant="contained"
          sx={{
            opacity: 0,
            animation: "fadeInButton 1s 3s forwards",
            boxShadow: "0 0 20px 5px #21cbf3",
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: "0 0 40px 10px #2196f3",
            },
          }}
          onClick={() => window.location.assign("/login")}
        >
          Se connecter
        </ConnectButton>
        <style>
          {`
            @keyframes bgFadeIn {
              from { background: #fff; }
              to { background: linear-gradient(135deg, #e0f7fa, #fff); }
            }
            @keyframes fadeInTitle {
              from { opacity: 0; transform: translateY(-30px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes fadeInSubtitle {
              from { opacity: 0; transform: translateY(30px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes fadeInButton {
              from { opacity: 0; transform: scale(0.8) rotate(-10deg);}
              70% { transform: scale(1.05) rotate(2deg);}
              to { opacity: 1; transform: scale(1) rotate(0);}
            }
            .MuiPaper-root {
              animation: bgFadeIn 1s 0s forwards;
            }
          `}
        </style>
      </AnimatedPaper>
    </Box>
  );
}
