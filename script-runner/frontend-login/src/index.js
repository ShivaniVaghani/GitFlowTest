// frontend-login/src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext";
import LoginPage from "./pages/auth/LoginPage";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <LoginPage />
    </AppContextProvider>
  </BrowserRouter>
);
