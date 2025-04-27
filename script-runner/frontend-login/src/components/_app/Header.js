import React, { useContext } from "react";
import DashboardMenus from "./DashboardMenus.js";
import { AppContext } from "../../context/AppContext.js";
const Header = ({setShowNames, showNames}) => {
  const { theme } = useContext(AppContext);
  return (
    <header
      className={`${theme === "dark"
        ? "dark-mode"
        : theme === "high-contrast"
          ? "high-contrast"
          : ""
        }`}
    >
      <div
        className={`${theme === "dark"
          ? "dark-mode"
          : theme === "high-contrast"
            ? "high-contrast"
            : ""
          }`}
      >
        <div
          className={`flex items-center gap-4 ${theme === "dark"
            ? "dark-mode"
            : theme === "high-contrast"
              ? "high-contrast"
              : ""
            }`}
        >
          <div className="hidden lg:block">
            <DashboardMenus setShowNames={setShowNames} showNames={showNames}/> {/* This will be visible on `lg` and above */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
