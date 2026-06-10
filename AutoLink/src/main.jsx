import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { AuthProvider } from "./app/context/AuthContext";
import { CarsProvider } from "./app/context/CarContext";
import { FavoritesProvider } from "./app/context/FavoritesContext";
import { ProposalsProvider } from "./app/context/ProposalsContext";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CarsProvider>
      <FavoritesProvider>
        <ProposalsProvider>
          <App />
        </ProposalsProvider>
      </FavoritesProvider>
    </CarsProvider>
  </AuthProvider>
);