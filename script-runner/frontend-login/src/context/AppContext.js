// frontend-login/src/context/AppContext.js

import React, { createContext, useState } from "react";

// 1) Create the Context object
export const AppContext = createContext({
  user: null,
  setUser: () => {},
  theme: "light",
  fetchNotifications: () => {},
  toggleLangMode: () => {},
  langMode: "en",
});

// 2) Default‐export the Provider component
const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [langMode, setLangMode] = useState("en");

  const toggleLangMode = () => {
    setLangMode((prev) =>
      prev === "en" ? "ur" : prev === "ur" ? "ar" : "en"
    );
  };

  const fetchNotifications = (page) => {
    // stub: replace with real fetch if needed
    console.log("fetchNotifications:", page);
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, theme, fetchNotifications, toggleLangMode, langMode }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
